import { GameResponse } from "@/services/games";
import { GameCard, GameCardSkeleton } from "./game-card";

type GamesGrid = {
  games: GameResponse[];
};

const gridClassNames =
  "grid grid-cols-1 gap-6 gap-y-12 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-cols-max";

export const GamesGridSkeleton = ({ rows }: { rows?: number }) => (
  <div className={gridClassNames}>
    {Array.from({ length: rows ?? 1 }).map((_, i) => (
      <>
        <GameCardSkeleton />
        <div className="hidden w-full h-full xs:block">
          <GameCardSkeleton />
        </div>
        <div className="hidden w-full h-full md:block">
          <GameCardSkeleton />
        </div>
        <div className="hidden w-full h-full lg:block">
          <GameCardSkeleton />
        </div>
      </>
    ))}
  </div>
);
export const GamesGrid = ({ games }: GamesGrid) => {
  return (
    <div className={gridClassNames}>
      {games.map((game) => (
        <GameCard game={game} />
      ))}
    </div>
  );
};
