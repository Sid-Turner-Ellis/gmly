import { AuthenticatedUser } from "@/hooks/use-auth";
import { TeamResponse, TeamRoles, TeamService } from "../team-service";
import { useStrapiImageUpload } from "@/hooks/use-strapi-image-upload";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Heading, headingVariants } from "@/components/heading";
import { EditableImagePageSection } from "@/components/editable-image-page-section";
import { cn } from "@/utils/cn";
import { useOptimisticMutation } from "@/hooks/use-optimistic-mutation";
import { useToast } from "@/providers/toast-provider";
import { validateTeamName } from "../util";
import { StrapiError } from "@/utils/strapi-error";
import { useQueryClient } from "@tanstack/react-query";

type TeamPageContent = {
  team: TeamResponse;
  teamProfile:
    | NonNullable<
        AuthenticatedUser["data"]["profile"]["team_profiles"]["data"]
      >[0]
    | null;
};
export const TeamPageContent = ({ team, teamProfile }: TeamPageContent) => {
  const editableImageProps = useStrapiImageUpload();
  const [isEditMode, setIsEditMode] = useState(false);
  const isFounder = teamProfile?.attributes.role === "founder";
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [teamNameInputValue, setTeamNameInputValue] = useState(
    team.attributes.name
  );

  const { mutate: updateTeamMutation, isError: updateTeamErrorIsError } =
    useOptimisticMutation<
      TeamResponse,
      (
        data: Parameters<typeof TeamService.updateTeam>[1]
      ) => ReturnType<typeof TeamService.updateTeam>
    >(
      async (data) => {
        const teamNameErrorMessage = data.name && validateTeamName(data.name);

        if (teamNameErrorMessage) {
          throw new Error(teamNameErrorMessage);
        }
        return TeamService.updateTeam(team.id, data);
      },
      {
        queryKey: ["team", team.id],
        updateCache(variables, previousValueDraft) {
          if (previousValueDraft) {
            previousValueDraft.attributes.name =
              variables.name ?? previousValueDraft.attributes.name;

            if (variables.image) {
              // TODO: Find the URL of the upload  and set that as the URL. Might not be necessary actually as we look at the object URL anyway
            }
          }

          return previousValueDraft;
        },
        onError(error: any) {
          const errorMessage = StrapiError.isStrapiError(error)
            ? error.error.message
            : "message" in error && error?.message?.length
            ? error.message
            : "Something went wrong";

          addToast({
            type: "error",
            message: errorMessage,
          });
        },
        onSuccess() {
          addToast({
            type: "success",
            message: "Profile updated",
          });

          queryClient.invalidateQueries(["tw-cache", "user"]);
        },
      }
    );

  useEffect(() => {
    if (isEditMode) {
      inputRef.current?.focus();
    }
  }, [isEditMode]);

  // Keep the input value in sync with the team name
  useEffect(() => {
    if (!isEditMode || updateTeamErrorIsError) {
      setTeamNameInputValue(team.attributes.name);
    }
  }, [team.attributes.name, updateTeamErrorIsError]);

  const onSave = () => {
    const { detail, status } = editableImageProps.imageUploadState;
    const image = status === "complete" ? detail : undefined;

    updateTeamMutation({ name: teamNameInputValue, image });
  };

  return (
    <div>
      <EditableImagePageSection
        isEditMode={isEditMode}
        onSave={onSave}
        initialImage={team.attributes.image}
        TitleSection={
          isEditMode ? (
            <input
              ref={inputRef}
              type="text"
              value={teamNameInputValue}
              onChange={(e) => setTeamNameInputValue(e.target.value)}
              className={cn(headingVariants({ variant: "h1" }), [
                "bg-transparent",
                "mb-0",
                "border",
                "border-solid",
                "text-brand-white",
                "rounded",
                "cursor-text",
                "outline-none",
                "focus:outline-none",
                "border-brand-navy-accent-light",
                "focus:border-brand-gray",
                "px-2",
                "w-56",
              ])}
            />
          ) : (
            <Heading
              variant="h1"
              className={
                "mb-0 outline-none cursor-default focus:outline-none overflow-hidden"
              }
            >
              {team.attributes.name}
            </Heading>
          )
        }
        ContentSection={
          <>
            <div>Team nameo</div>
            <div>Team name</div>
          </>
        }
        {...editableImageProps}
        setIsEditMode={setIsEditMode}
        showEditButton={isFounder}
      />
    </div>
  );
};
