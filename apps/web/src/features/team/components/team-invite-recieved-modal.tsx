import { Button } from "@/components/button";
import { ModalCard } from "@/components/modal/modal-card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TeamService } from "../team-service";
import { useToast } from "@/providers/toast-provider";
import { useRouter } from "next/router";

// TODO: readirect to the team page if accepts

type TeamInviteReceivedModalProps = {
  teamName: string;
  teamProfileId: number;
  teamId: number;
  gameName: string;
  invitedBy: string;
  closeModal: () => void;
  onRespondToInvite?: () => void;
};

export const TeamInviteReceivedModal = ({
  teamName,
  teamProfileId,
  teamId,
  gameName,
  invitedBy,
  closeModal,
  onRespondToInvite,
}: TeamInviteReceivedModalProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { addToast } = useToast();
  const { mutate: respondToTeamInviteMutation } = useMutation(
    async ({ accept }: { accept: boolean }) => {
      console.log(accept, teamProfileId);
      await TeamService.respondToInvite(teamProfileId, accept);
      return undefined;
    },
    {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries(["tw-cache", "user"]);
        onRespondToInvite?.();

        if (!variables.accept) {
          router.push(`/team/${teamId}`);
        }

        addToast({
          type: "success",
          message: `You have ${
            variables.accept ? "accepted" : "declined"
          } the invite`,
        });
      },
      onSettled() {
        closeModal();
      },
    }
  );
  return (
    <ModalCard
      title={`Join ${teamName}`}
      size="sm"
      description={`${invitedBy} has invited you to join their team, if you do not know this person decline this invite.`}
      Footer={
        <div className="flex justify-end items-center gap-3">
          <Button
            variant={"secondary"}
            title="Decline"
            onClick={() => {
              respondToTeamInviteMutation({
                accept: false,
              });
            }}
          />
          <Button
            variant={"primary"}
            title="Accept"
            onClick={() => {
              respondToTeamInviteMutation({
                accept: true,
              });
            }}
          />
        </div>
      }
    />
  );
};
