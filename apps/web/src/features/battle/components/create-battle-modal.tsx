import { Button } from "@/components/button";
import { Modal } from "@/components/modal/modal";
import { AuthenticatedUser } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BattleService, CreateBattleParams } from "../battle-service";
import { GameResponse } from "@/features/game/game-service";
import { TeamService } from "@/features/team/team-service";
import { useDollarInput } from "@/components/dollar-input";
import { TeamSelectionRow } from "./team-selection-row";
import { useToast } from "@/providers/toast-provider";
import { StrapiError } from "@/utils/strapi-error";
import { getAvailableTimes, getTeamSizeNumberFromTeamOption } from "../util";
import { CreateBattleDetailsStep } from "./create-battle-details-modal-step";
import { ScrollArea } from "@/components/scroll-area";
import { USER_QUERY_KEY } from "@/constants";

export type CreateBattleInputs = Omit<
  CreateBattleParams,
  "teamProfileId" | "invitedTeamId"
> & { teamSize: `${number}v${number}` };

export const CreateBattleModal = ({
  isOpen,
  game,
  closeModal,
  user,
  teamProfile,
  invitedTeamId,
}: {
  isOpen: boolean;
  closeModal: () => void;
  user: AuthenticatedUser;
  invitedTeamId?: number;
  game: GameResponse;
  teamProfile: NonNullable<
    AuthenticatedUser["data"]["profile"]["team_profiles"]["data"]
  >[number];
}) => {
  const [isFirstStep, setIsFirstStep] = useState(true);
  const teamId = teamProfile.attributes.team.data?.id;
  const isTeamQueryEnabled = isOpen && !isFirstStep && !!teamId;
  const { amountInCents, ...dollarInputProps } = useDollarInput();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const {
    data: teamData,
    isLoading: teamDataIsLoading,
    isError: teamDataIsError,
    refetch: refetchTeamData,
  } = useQuery(["team", teamId], () => TeamService.getTeam(teamId!), {
    enabled: isTeamQueryEnabled,
  });

  const {
    mutate: createBattleMutation,
    isLoading: createBattleMutationIsLoading,
  } = useMutation(BattleService.createBattle, {
    onSuccess() {
      addToast({
        type: "success",
        message: "Battle created successfully",
      });

      // TODO: Invalidate the battles list
      queryClient.invalidateQueries(USER_QUERY_KEY);
      closeModal();
    },
    async onError(error) {
      const strapiError = StrapiError.isStrapiError(error) ? error : null;

      const squadNotEligible =
        strapiError?.error.message === "SquadNotEligible";

      if (squadNotEligible) {
        setTeamSelection([]);
        await refetchTeamData();

        addToast({
          type: "warning",
          message: "One or more of the selected team members are not eligible",
        });
      } else {
        addToast({
          type: "error",
          message: "An error occurred while creating the battle",
        });

        closeModal();
      }
    },
  });
  const [teamSelection, setTeamSelection] = useState<number[]>([]);
  const timeOptions = useMemo(() => getAvailableTimes(), [isOpen]);
  const teamSizeOptions = useMemo(
    () =>
      Array.from(
        { length: game.attributes.max_team_size },
        (_, i) => `${i + 1}v${i + 1}`
      ) as `${number}v${number}`[],
    [game.attributes.max_team_size]
  );

  const { control, handleSubmit, watch, trigger } = useForm<CreateBattleInputs>(
    {
      defaultValues: {
        teamSize: teamSizeOptions[0],
        series: "Bo1",
        time: timeOptions[0],
        region: user.data.profile.region!,
      },
    }
  );
  const teamSize = watch("teamSize");

  const onSubmit: SubmitHandler<CreateBattleInputs> = async (formValues) => {
    const timeIsInvalid = new Date(formValues.time) < new Date();

    if (timeIsInvalid) {
      addToast({
        type: "error",
        message: "The time you selected is in the past",
      });
      return;
    }

    createBattleMutation({
      time: formValues.time,
      region: formValues.region,
      series: formValues.series,
      wagerAmount: amountInCents ?? 0,
      customAttributes: formValues.customAttributes ?? {},
      teamSelection,
      teamProfileId: teamProfile.id,
      invitedTeamId,
    });
  };

  useEffect(() => {
    if (teamSize && amountInCents) {
      const teamSizeNumber = getTeamSizeNumberFromTeamOption(teamSize);
      const wagerCentsPerPlayer = amountInCents / teamSizeNumber;
      const wagerToTwoDp = (
        (Math.floor(wagerCentsPerPlayer) * teamSizeNumber) /
        100
      ).toFixed(2);
      dollarInputProps.setValue(wagerToTwoDp);
    }
  }, [teamSize, amountInCents]);

  useEffect(() => {
    if (teamDataIsError) {
      addToast({
        type: "error",
        message: "An error occurred while fetching team data",
      });
      closeModal();
    }
  }, [teamDataIsError]);

  return (
    <Modal
      title="Create Battle"
      isOpen={isOpen}
      closeModal={closeModal}
      isLoading={
        (isTeamQueryEnabled && teamDataIsLoading) ||
        createBattleMutationIsLoading
      }
      description={isFirstStep ? "Match Settings" : "Select Team Members"}
      isClosable
      Footer={
        <div className="flex justify-end gap-3">
          {isFirstStep ? (
            <CreateBattleDetailsStep.Footer
              closeModal={closeModal}
              profileBalance={user.data.profile.balance}
              wagerAmount={amountInCents}
              isFormValid={trigger}
              teamSize={teamSize}
              nextStep={() => setIsFirstStep(false)}
              wagerModeEnabled={user.data.profile.wager_mode}
            />
          ) : (
            <>
              <Button
                variant={"secondary"}
                title="Back"
                onClick={() => setIsFirstStep(true)}
              />
              <Button
                title="Confirm"
                disabled={
                  teamSelection.length + 1 !==
                  getTeamSizeNumberFromTeamOption(teamSize)
                }
                onClick={handleSubmit(onSubmit)}
              />
            </>
          )}
        </div>
      }
    >
      {isFirstStep ? (
        <CreateBattleDetailsStep.Content
          control={control}
          timeOptions={timeOptions}
          teamSizeOptions={teamSizeOptions}
          teamSize={getTeamSizeNumberFromTeamOption(teamSize)}
          customAttributes={game.attributes.custom_attributes}
          {...dollarInputProps}
        />
      ) : (
        <ScrollArea viewportClassName="max-h-56" type="always">
          {teamData?.data &&
            teamData.data.attributes.team_profiles.data
              ?.filter((tp) => tp.id !== teamProfile.id)
              .map((tp) => (
                <TeamSelectionRow
                  key={tp.id}
                  teamSelection={teamSelection}
                  teamProfile={tp}
                  setTeamSelection={setTeamSelection}
                  teamSize={getTeamSizeNumberFromTeamOption(teamSize)}
                  totalWagerAmountInCents={amountInCents}
                />
              ))}
        </ScrollArea>
      )}
    </Modal>
  );
};
