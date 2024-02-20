import { Button } from "@/components/button";
import { GameResponse } from "@/features/game/game-service";
import { CreateTeamModal } from "@/features/team/components/create-team-modal/create-team-modal";
import { AuthenticatedUser } from "@/hooks/use-auth";
import { useState } from "react";
import { CreateBattleModal } from "./create-battle-modal";
import { useToast } from "@/providers/toast-provider";

export const BattlesPageContent = ({
  user,
  game,
}: {
  user: AuthenticatedUser;
  game: GameResponse;
}) => {
  const [isCreateBattleModalOpen, setIsCreateBattleModalOpen] = useState(false);
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
  const { addToast } = useToast();
  const teamProfileForGame = user.data.profile.team_profiles.data?.find(
    (tp) => tp.attributes.team.data?.attributes.game.data?.id === game.id
  );
  const isUserInTeamForGame =
    teamProfileForGame && !teamProfileForGame.attributes.is_pending;
  const isUserLeaderOrFounderForGame =
    isUserInTeamForGame && teamProfileForGame.attributes.role !== "member";

  return (
    <div>
      {teamProfileForGame && isCreateBattleModalOpen && (
        <CreateBattleModal
          teamProfile={teamProfileForGame}
          user={user}
          isOpen={isCreateBattleModalOpen}
          game={game}
          closeModal={() => setIsCreateBattleModalOpen(false)}
        />
      )}
      {user && (
        <CreateTeamModal
          user={user}
          setIsOpen={setIsCreateTeamModalOpen}
          onTeamCreated={() => {
            setIsCreateBattleModalOpen(true);
          }}
          onTeamCreateError={() => {
            addToast({
              type: "error",
              message: "Failed to create team. Please try again later.",
            });
          }}
          isOpen={isCreateTeamModalOpen}
          fixedGameId={1}
        />
      )}
      <Button
        title={isUserInTeamForGame ? "Create a battle" : "Create a team"}
        onClick={() => {
          if (!isUserInTeamForGame) {
            setIsCreateTeamModalOpen(true);
          } else {
            if (!isUserLeaderOrFounderForGame) {
              addToast({
                type: "warning",
                message: "Only team leaders or founders can create battles.",
              });
              return;
            }
            setIsCreateBattleModalOpen(true);
          }
        }}
      />
    </div>
  );
};
