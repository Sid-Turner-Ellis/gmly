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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Text } from "@/components/text";
import { Image } from "@/components/image";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";
import { toPascalCase } from "@/utils/to-pascal-case";
import { TeamMembersTable } from "./team-members-table";
import { Button } from "@/components/button";
import { useRouter } from "next/router";
import { Modal } from "@/components/modal";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const isTeamDeletable = Math.floor(Math.random() * 1000) % 2 === 0; // TODO: Check by looking at upcoming games
  const isFounder = teamProfile?.attributes.role === "founder";
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [teamNameInputValue, setTeamNameInputValue] = useState(
    team.attributes.name
  );

  const { mutate: deleteTeamMutation, isLoading: deleteTeamMutationIsLoading } =
    useMutation(({ id }: { id: number }) => TeamService.deleteTeam(id), {
      onSuccess() {
        queryClient.invalidateQueries(["tw-cache", "user"]);
        addToast({ type: "success", message: "Team deleted" });
        router.replace("/");
      },
      onError(e) {
        // TODO: check if the error is because there are pending games
        addToast({ type: "error", message: "Something went wrong" });
      },
    });

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
    <div className="">
      <Modal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        title="Are you sure?"
        description="This action cannot be undone, and all team members will be removed from the team."
        isClosable
        isLoading={deleteTeamMutationIsLoading}
        Footer={
          <div className="flex justify-end w-full gap-4">
            <Button
              variant="secondary"
              title="Cancel"
              onClick={() => setIsDeleteModalOpen(false)}
            />
            <Button
              variant="delete"
              title="Delete"
              disabled={deleteTeamMutationIsLoading}
              onClick={() => {
                deleteTeamMutation({ id: team.id });
              }}
            />
          </div>
        }
      />
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
        ContentSection={<></>}
        {...editableImageProps}
        setIsEditMode={setIsEditMode}
        showEditButton={isFounder}
      />

      {isFounder && (
        <div className="flex justify-end w-full gap-4">
          <Button variant={"secondary"} title="Edit team" />
          <Button
            variant={"delete"}
            title="Delete team"
            onClick={() => {
              if (isTeamDeletable) {
                setIsDeleteModalOpen(true);
              } else {
                addToast({
                  type: "error",
                  message: "You cannot delete a team with upcoming games",
                });
              }
            }}
          />
        </div>
      )}
      <div className={cn("mt-4 md:mt-8")}> </div>
      <TeamMembersTable team={team} />
    </div>
  );
};
