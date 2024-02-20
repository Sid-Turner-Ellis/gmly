import { GameResponse } from "@/features/game/game-service";
import { AuthenticatedUser, useAuth } from "@/hooks/use-auth";
import { CreateBattleButton } from "./create-battle-button";

export const BattlesPageContent = ({
  user,
  game,
}: {
  user: AuthenticatedUser;
  game: GameResponse;
}) => {
  return (
    <div>
      <CreateBattleButton gameOrGameId={game} />
    </div>
  );
};
