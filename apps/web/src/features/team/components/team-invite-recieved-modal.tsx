import { Button } from "@/components/button";
import { ModalCard } from "@/components/modal/modal-card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TeamService } from "../team-service";
import { useToast } from "@/providers/toast-provider";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/use-auth";
import { useId } from "react";
import { useNotifications } from "@/features/notification/use-notifications";
import {
  NOTIFICATION_TYPES,
  isTeamInviteReceivedNotification,
} from "@/features/notification/notification-service";

// TODO: redirect to the team page if accepts

type TeamInviteReceivedModalProps = {
  teamName: string;
  teamProfileId: number;
  teamId: number;
  gameName: string;
  gameId: number;
  invitedBy: string;
  closeModal: () => void;
  onRespondToInvite?: () => void;
};

export const TeamInviteReceivedModal = ({
  teamName,
  teamProfileId,
  teamId,
  gameName,
  gameId,
  invitedBy,
  closeModal,
  onRespondToInvite,
}: TeamInviteReceivedModalProps) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { addToast } = useToast();
  const { user } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  const profileId = user?.data.profile.id;
  const {
    data: teamsForProfileData,
    isLoading: isTeamsForProfileLoading,
    isSuccess: teamsForProfileIsSuccess,
  } = useQuery(["fake"], () => TeamService.getTeamsForProfile(profileId!), {
    enabled: !!profileId,
    onError() {
      addToast({
        type: "error",
        message: "Something went wrong, please try again later.",
      });
      closeModal();
    },
  });

  const { mutate: respondToTeamInviteMutation } = useMutation(
    async ({ accept }: { accept: boolean }) => {
      const linkedTeamInviteReceivedNotification = notifications.find(
        (n) =>
          isTeamInviteReceivedNotification(n) &&
          n.attributes.team.data?.id === teamId
      );

      await TeamService.respondToInvite(teamProfileId, accept);

      if (linkedTeamInviteReceivedNotification?.id) {
        await markAsRead(linkedTeamInviteReceivedNotification.id);
      }
    },
    {
      onSuccess(data, variables, context) {
        queryClient.invalidateQueries(["tw-cache", "user"]);
        queryClient.invalidateQueries(["team", teamId]);

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

  const onAcceptButtonClick = () => {
    const teamForProfileAndGame =
      teamsForProfileData?.data.find(
        (team) => team.attributes.game.data?.id === gameId
      ) ?? null;

    if (teamForProfileAndGame) {
      addToast(
        {
          type: "error",
          message:
            "You can't join this team as you're already on a roster for this ladder",
          button: {
            label: "Team page",
            onClick() {
              router.push(`/team/${teamForProfileAndGame.id}`);
              closeModal();
            },
          },
        },
        "team-invite-received-modal-error-toast"
      );
    } else {
      respondToTeamInviteMutation({
        accept: true,
      });
      closeModal();
    }
  };

  return (
    <ModalCard
      title={`Join ${teamName}`}
      size="sm"
      description={`${invitedBy} has invited you to join their team, if you do not know this person decline this invite.`}
      Footer={
        <div className="flex items-center justify-end gap-3">
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
            disabled={!teamsForProfileIsSuccess}
            onClick={onAcceptButtonClick}
          />
        </div>
      }
    />
  );
};
