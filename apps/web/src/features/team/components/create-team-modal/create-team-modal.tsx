import { Button } from "@/components/button";
import { ErrorPage } from "@/components/error-page";
import { Modal, ModalProps } from "@/components/modal/modal";
import { GameService } from "@/features/game/game-service";
import { useStrapiImageUpload } from "@/hooks/use-strapi-image-upload";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SubmitHandler, set, useForm } from "react-hook-form";
import { TeamRoles, TeamService } from "../../team-service";
import { AuthenticatedUser, useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/router";
import { useToast } from "@/providers/toast-provider";
import { CreateTeamModalStep } from "./create-team-modal-step";
import { TeamMemberUpdate } from "../../types";
import { InviteTeamModalStep } from "./invite-team-modal-step";
import { profanity } from "@2toad/profanity";
import { validateTeamName } from "../../util";
import { MAX_TEAM_MEMBERS } from "../../constants";

// TODO: start using the modal component

export type CreateTeamModalProps = {
  user: AuthenticatedUser;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const CreateTeamModal = ({
  isOpen,
  setIsOpen,
  user,
}: CreateTeamModalProps) => {
  const [isFirstStep, setIsFirstStep] = useState(true);
  const [stringifiedGameId, setStringifiedGameId] = useState<string | null>(
    null
  );
  const { addToast } = useToast();
  const [gameSelectError, setGameSelectError] = useState(false);
  const router = useRouter();
  const initialTeamMembers: TeamMemberUpdate[] = [
    {
      image: user.data.profile.avatar?.data?.attributes ?? null,
      username: user.data.profile.username!,
      userId: user.data.profile.id,
      isPending: false,
      role: "founder",
    },
  ];
  const [teamMemberInvites, setTeamMemberInvites] =
    useState(initialTeamMembers);
  const {
    data: gamesQueryData,
    isLoading: gameQueryIsLoading,
    isError: gameQueryIsError,
  } = useQuery(["recursive-games"], () => GameService.recursivelyGetGames(), {
    cacheTime: 1000 * 60 * 60 * 24,
    staleTime: 1000 * 60 * 60 * 24,
  });
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    formState,
    register,
    reset: resetFormState,
    getValues,
    setError,
  } = useForm<{ teamName: string }>();

  const {
    imageUploadState,
    fileObjectUrl,
    onFileInputChange,
    resetFileState,
    resetUploadState,
  } = useStrapiImageUpload();

  useEffect(() => {
    setGameSelectError(false);
  }, [stringifiedGameId]);

  const stringifiedGameOptionIds = useMemo(
    () =>
      gamesQueryData ? gamesQueryData.map((game) => game.id.toString()) : [],
    [gamesQueryData]
  );

  const getGameSelectLabelFromStringifiedGameId = useCallback(
    (stringId: string) => {
      const id = parseInt(stringId);
      const game = gamesQueryData?.find((game) => game.id === id);

      return game?.attributes.title ?? "";
    },
    [gamesQueryData]
  );

  const onTeamDetailsSubmit = handleSubmit(({ teamName }) => {
    const teamNameError = validateTeamName(teamName);
    if (teamNameError) {
      setError("teamName", {
        type: "custom",
        message: teamNameError,
      });
      return;
    }
    if (!stringifiedGameId) {
      setGameSelectError(true);
      return;
    }
    setIsFirstStep(false);
  });

  const {
    mutate: createTeamMutation,
    isLoading: createTeamMutationIsLoading,
    isError: createTeamMutationIsError,
  } = useMutation(
    async () => {
      // create the team
      const teamName = getValues("teamName");
      const imageId =
        imageUploadState.status === "complete"
          ? imageUploadState.detail
          : undefined;

      const newlyCreatedTeam = await TeamService.createTeam({
        name: teamName,
        gameId: parseInt(stringifiedGameId!),
        image: imageId,
      });

      await TeamService.bulkUpdateTeamMembers(
        newlyCreatedTeam.data.id,
        teamMemberInvites.map((tmi) => ({
          profile: tmi.userId,
          role: tmi.role,
        }))
      );

      return newlyCreatedTeam.data.id;
    },
    {
      onSuccess(data) {
        queryClient.invalidateQueries(["tw-cache", "user"]);
        addToast({ type: "success", message: "Team created!" });
        router.push(`/team/${data}`);
      },
      onSettled() {
        closeModal();
      },
    }
  );

  const resetState = () => {
    setIsOpen(false);
    setStringifiedGameId(null);
    setIsFirstStep(true);
    resetFileState();
    resetUploadState();
    resetFormState();
    setTeamMemberInvites(initialTeamMembers);
  };

  const closeModal = () => {
    setIsOpen(false);
    resetState();
  };

  useEffect(() => {
    if (createTeamMutationIsError || gameQueryIsError) {
      closeModal();
      router.push("/500");
    }
  }, [createTeamMutationIsError, gameQueryIsError]);

  return (
    <Modal
      title={isFirstStep ? "Create team" : "Invite team"}
      isOpen={isOpen}
      isClosable
      closeModal={() => closeModal()}
      isLoading={createTeamMutationIsLoading || gameQueryIsLoading}
      size={"md"}
      description={
        isFirstStep
          ? "Team details"
          : `Invite team (up to ${
              MAX_TEAM_MEMBERS - teamMemberInvites.length
            } more players)`
      }
      Footer={
        <div className="flex justify-end w-full gap-2">
          {isFirstStep ? (
            <CreateTeamModalStep.Footer
              onSubmit={onTeamDetailsSubmit}
              closeModal={closeModal}
              imageUploadState={imageUploadState}
            />
          ) : (
            <InviteTeamModalStep.Footer
              onSubmit={createTeamMutation}
              setIsFirstStep={setIsFirstStep}
            />
          )}
        </div>
      }
    >
      <div className="relative z-0">
        {isFirstStep && (
          <CreateTeamModalStep.Content
            imageUploadState={imageUploadState}
            fileObjectUrl={fileObjectUrl}
            onFileInputChange={onFileInputChange}
            handleSubmit={handleSubmit}
            register={register}
            formState={formState}
            getValues={getValues}
            stringifiedGameId={stringifiedGameId}
            setStringifiedGameId={setStringifiedGameId}
            gameSelectError={gameSelectError}
            stringifiedGameOptionIds={stringifiedGameOptionIds}
            getGameSelectLabelFromStringifiedGameId={
              getGameSelectLabelFromStringifiedGameId
            }
            gameQueryIsError={gameQueryIsError}
            gameQueryIsLoading={gameQueryIsLoading}
            reset={resetFormState}
            setError={setError}
          />
        )}
        {!isFirstStep && (
          <InviteTeamModalStep.Content
            teamMemberInvites={teamMemberInvites}
            setTeamMemberInvites={setTeamMemberInvites}
          />
        )}
      </div>
    </Modal>
  );
};
