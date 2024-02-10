import { GameService } from "@/features/game/game-service";
import { useQuery } from "@tanstack/react-query";

export const useGetAllGames = (enabled: boolean = true) => {
  const {
    data: gamesQueryData,
    isLoading: gameQueryIsLoading,
    isError: gameQueryIsError,
  } = useQuery(["recursive-games"], () => GameService.recursivelyGetGames(), {
    cacheTime: 1000 * 60 * 60 * 24,
    staleTime: 1000 * 60 * 60 * 24,
    enabled,
  });

  return {
    gamesQueryData,
    gameQueryIsLoading,
    gameQueryIsError,
  };
};
