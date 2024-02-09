import { useQuery } from "@tanstack/react-query";
import { GameResponse, GameService } from "../game-service";
import { Select } from "@/components/select";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

export type GameSelectProps = {
  selectedGame: GameResponse | null;
  setSelectedGame: React.Dispatch<React.SetStateAction<GameResponse | null>>;
  gameIdsToExclude?: number[];
  isDisabled?: boolean;
  gameSelectError?: boolean | string;
};

/**
 * The state we need to keep:
 * - the stringified game ID
 */

export const useGameSelect = () => {
  const [selectedGame, setSelectedGame] = useState<GameResponse | null>(null);
  const [gameSelectError, setGameSelectError] = useState<boolean | string>(
    false
  );

  return {
    selectedGame,
    setSelectedGame,
    gameSelectError,
    setGameSelectError,
  };
};

export const GameSelect = ({
  selectedGame,
  setSelectedGame,
  gameIdsToExclude,
  gameSelectError,
  isDisabled = false,
}: GameSelectProps) => {
  const [stringifiedGameId, setStringifiedGameId] = useState<string | null>(
    () => selectedGame?.id.toString() ?? null
  );

  const {
    data: gamesQueryData,
    isLoading: gameQueryIsLoading,
    isError: gameQueryIsError,
  } = useQuery(["recursive-games"], () => GameService.recursivelyGetGames(), {
    cacheTime: 1000 * 60 * 60 * 24,
    staleTime: 1000 * 60 * 60 * 24,
    enabled: !isDisabled,
  });
  const router = useRouter();

  useEffect(() => {
    if (gameQueryIsError) {
      router.push("/500");
    }
  }, [gameQueryIsError]);

  useEffect(() => {
    console.log("stringified game id change", stringifiedGameId);
    if (stringifiedGameId) {
      const selectedGameId = parseInt(stringifiedGameId);
      const selectedGame =
        gamesQueryData?.find((game) => game.id === selectedGameId) ?? null;
      setSelectedGame(selectedGame);
    }
  }, [stringifiedGameId]);

  const stringifiedGameOptionIds = useMemo(() => {
    const gamesQueryWithoutExcludedGames = gamesQueryData
      ? gamesQueryData?.filter((game) => !gameIdsToExclude?.includes(game.id))
      : [];

    return gamesQueryWithoutExcludedGames.map((game) => game.id.toString());
  }, [gamesQueryData, gameIdsToExclude]);

  const getGameSelectLabelFromStringifiedGameId = useCallback(
    (stringId: string) => {
      const id = parseInt(stringId);
      const game = gamesQueryData?.find((game) => game.id === id);

      return game?.attributes.title ?? "";
    },
    [gamesQueryData]
  );

  return (
    <Select
      disabled={gameQueryIsLoading || gameQueryIsError || isDisabled}
      options={stringifiedGameOptionIds}
      setValue={setStringifiedGameId}
      error={gameSelectError}
      value={stringifiedGameId}
      getLabel={getGameSelectLabelFromStringifiedGameId}
    />
  );
};
