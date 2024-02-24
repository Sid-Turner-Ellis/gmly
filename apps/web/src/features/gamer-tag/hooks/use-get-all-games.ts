import { GameService } from "@/features/game/game-service";
import { useQuery } from "@tanstack/react-query";

export const useGetAllGames = (enabled: boolean = true) => {
  const {
    data: gamesQueryData,
    isLoading: gameQueryIsLoading,
    isError: gameQueryIsError,
  } = useQuery(["recursive-games"], () => GameService.recursivelyGetGames(), {
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 10,
    enabled,
  });

  return {
    gamesQueryData,
    gameQueryIsLoading,
    gameQueryIsError,
  };
};
