/**
 * battle controller
 */

import { factories } from "@strapi/strapi";
import { errors } from "@strapi/utils";
import { z } from "zod";
import matchOptionsSchema from "../../../components/general/match-options.json";

const REGIONS = matchOptionsSchema.attributes.region.enum;

enum CreateBattleErrors {
  InvalidInput = "InvalidInput",
  SquadNotEligible = "SquadNotEligible",
  InvalidTime = "InvalidTime",
}

const createBattleInputSchema = z.object({
  total_wager_amount: z.number(),
  invited_team_id: z.number().optional(),
  team_selection: z.array(z.number()),
  date: z.string().datetime(),
  match_options: z.object({
    custom_attribute_inputs: z.array(
      z.object({
        attribute_id: z.string(),
        value: z.union([z.string(), z.array(z.string())]),
      }),
    ),
    series: z.number(),
    region: z.enum(REGIONS as any),
  }),
});

const hasMoreThan1DecimalPlace = (number: number) => {
  const splitResult = number.toString().split(".");
  return splitResult.length > 1 ? splitResult[1].length > 1 : false;
};

const revertErroredTransaction = async ({
  battleId,
  matchId,
  teamSelectionId,
  transactionIds,
}: Partial<{
  battleId: number;
  matchId: number;
  teamSelectionId: number;
  transactionIds: number[];
}>) => {
  if (battleId) {
    await strapi.service("api::battle.battle").delete(battleId);
  }

  if (matchId) {
    await strapi.service("api::match.match").delete(matchId);
  }

  if (teamSelectionId) {
    const teamSelectionToDelete = await strapi
      .service("api::team-selection.team-selection")
      .findOne(teamSelectionId, {
        populates: {
          team_selection_profiles: true,
        },
      });

    await Promise.all(
      (teamSelectionToDelete.team_selection_profiles ?? []).map(async (tsp) =>
        strapi
          .service("api::team-selection-profile.team-selection-profile")
          .delete(tsp.id),
      ),
    );

    await strapi
      .service("api::team-selection.team-selection")
      .delete(teamSelectionId);
  }

  await Promise.all(
    transactionIds.map((transactionId) =>
      strapi.service("api::transaction.transaction").delete(transactionId),
    ),
  );
};

export default factories.createCoreController("api::battle.battle", {
  async createBattle(ctx) {
    const teamProfileId = parseInt(ctx.request.params.teamProfileId);
    const reqDataResult = createBattleInputSchema.safeParse(
      ctx.request.body.data,
    );

    if (!reqDataResult.success) {
      return ctx.badRequest(CreateBattleErrors.InvalidInput);
    }

    const reqData = reqDataResult.data;

    const captainsTeamProfile = await strapi
      .service("api::team-profile.team-profile")
      .findOne(teamProfileId, {
        populate: {
          profile: true,
          team: {
            populate: {
              team_profiles: {
                populate: {
                  profile: true,
                },
              },
              game: {
                populate: {
                  custom_attributes: {
                    populate: {
                      attribute: true,
                      options: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

    const game = captainsTeamProfile.team.game;
    const team = captainsTeamProfile.team;

    const isUserCaptain =
      captainsTeamProfile.profile.wallet_address === ctx.state.wallet_address;

    const isUserFounderOrLeader =
      captainsTeamProfile.role === "founder" ||
      captainsTeamProfile.role === "leader";

    if (!isUserCaptain || !isUserFounderOrLeader) {
      throw new errors.UnauthorizedError();
    }

    const invitedTeam =
      reqData.invited_team_id &&
      (await strapi.service("api::team.team").findOne(reqData.invited_team_id, {
        populate: {
          game: true,
          team_profiles: {
            populate: {
              profile: true,
            },
          },
        },
      }));

    const isInvitedTeamInSameGame =
      !invitedTeam || invitedTeam?.game.id === game.id;
    const isInvitedTeamADifferentTeam =
      invitedTeam || invitedTeam?.id !== team.id;

    if (!isInvitedTeamInSameGame || !isInvitedTeamADifferentTeam) {
      return ctx.badRequest(CreateBattleErrors.InvalidInput);
    }

    const teamSelectionProfiles = [
      ...reqData.team_selection.filter(
        (teamProfileId) => teamProfileId !== captainsTeamProfile.id,
      ),
      captainsTeamProfile.id,
    ];

    const isTeamSizeValid = teamSelectionProfiles.length <= game.max_team_size;
    const isSeriesValid = [1, 3, 5].includes(reqData.match_options.series);
    const isDateValid = new Date(reqData.date) > new Date();
    const isWagerMatch = reqData.total_wager_amount > 0;
    const wagerAmountPerPerson =
      reqData.total_wager_amount / teamSelectionProfiles.length;
    const isWagerAmountValid =
      wagerAmountPerPerson > 0
        ? !hasMoreThan1DecimalPlace(wagerAmountPerPerson)
        : true;

    const teamSelectionProfilesAreInTeam = teamSelectionProfiles.every(
      (teamSelectionProfileId) =>
        team.team_profiles.some((tp) => tp.id === teamSelectionProfileId),
    );

    const teamSelectionProfilesAreNotPending = teamSelectionProfiles.every(
      (teamSelectionProfileId) =>
        team.team_profiles.find((tp) => tp.id === teamSelectionProfileId)
          ?.is_pending === false,
    );

    if (
      !teamSelectionProfilesAreNotPending ||
      !isTeamSizeValid ||
      !isSeriesValid ||
      !isWagerAmountValid ||
      !teamSelectionProfilesAreInTeam ||
      !isDateValid ||
      (reqData.invited_team_id && !invitedTeam)
    ) {
      return ctx.badRequest(CreateBattleErrors.InvalidInput);
    }

    const requiredCustomAttributes = game.custom_attributes.filter(
      (ca) => ca.__component === "custom-attributes.select",
    );

    const hasRequiredCustomAttributes = requiredCustomAttributes.every((ra) =>
      reqData.match_options.custom_attribute_inputs.some(
        (cui) => cui.attribute_id === ra.attribute.attribute_id,
      ),
    );

    const customAttributeInputsAreValid =
      reqData.match_options.custom_attribute_inputs.reduce((acc, cui) => {
        if (!acc) return acc;

        const attribute = requiredCustomAttributes.find(
          (ra) => ra.attribute.attribute_id === cui.attribute_id,
        );

        if (attribute.__component === "custom-attributes.select") {
          const validOptionIds = attribute.options.map((o) => o.option_id);

          if (attribute.input_type === "multi-select") {
            return (
              Array.isArray(cui.value) &&
              cui.value.every((v) => validOptionIds.includes(v))
            );
          } else {
            return validOptionIds.includes(cui.value);
          }
        }

        return true;
      }, true);

    if (!hasRequiredCustomAttributes || !customAttributeInputsAreValid) {
      return ctx.badRequest(CreateBattleErrors.InvalidInput);
    }

    let createdBattleId;
    let createdTeamSelectionId;
    let createdMatchId;
    let createdTransactionsIds = [];

    try {
      const createdBattle = await strapi.service("api::battle.battle").create({
        data: {
          invited_team: reqData.invited_team_id ?? null,
          wager_amount: reqData.total_wager_amount ?? 0,
          match_options: {
            custom_attribute_inputs:
              reqData.match_options.custom_attribute_inputs,
            series: reqData.match_options.series,
            team_size: teamSelectionProfiles.length,
            game: game.id,
            region: reqData.match_options.region,
          },
          date: reqData.date,
        },
      });
      createdBattleId = createdBattle.id;

      const createdMatch = await strapi.service("api::match.match").create({
        data: {
          battle: createdBattleId,
          match_meta: {},
        },
      });
      createdMatchId = createdMatch.id;

      const createdTeamSelection = await strapi
        .service("api::team-selection.team-selection")
        .create({
          data: {
            team: team.id,
            home_matches: [createdMatchId],
          },
        });

      createdTeamSelectionId = createdTeamSelection.id;

      await Promise.all(
        teamSelectionProfiles.map(async (teamProfileId) => {
          const teamProfile = await strapi
            .service("api::team-profile.team-profile")
            .findOne(teamProfileId, {
              populate: {
                profile: true,
                team: true,
              },
            });

          const isCaptain = teamProfile.id === captainsTeamProfile.id;

          const wagerMode = teamProfile.profile.wager_mode;
          const trustMode = teamProfile.profile.trust_mode;

          if (isWagerMatch && !wagerMode) {
            throw new Error(CreateBattleErrors.SquadNotEligible);
          }

          if (isWagerMatch && !isCaptain && !trustMode) {
            throw new Error(CreateBattleErrors.SquadNotEligible);
          }

          // TODO: check whether the user is suspended or not
          const hasSufficientFunds =
            teamProfile.profile.balance >= wagerAmountPerPerson;

          if (!hasSufficientFunds) {
            throw new Error(CreateBattleErrors.SquadNotEligible);
          }

          await strapi
            .service("api::team-selection-profile.team-selection-profile")
            .create({
              data: {
                team_selection: createdTeamSelectionId,
                team_profile: teamProfile.id,
                is_captain: isCaptain,
              },
            });

          if (wagerAmountPerPerson > 0) {
            const createdTransaction = await strapi
              .service("api::transaction.transaction")
              .create({
                data: {
                  type: "out",
                  confirmed: true,
                  amount: wagerAmountPerPerson,
                  profile: teamProfile.profile.id,
                },
              });
            createdTransactionsIds.push(createdTransaction);
          }
        }),
      );
    } catch (error) {
      await revertErroredTransaction({
        battleId: createdBattleId,
        matchId: createdMatchId,
        teamSelectionId: createdTeamSelectionId,
        transactionIds: createdTransactionsIds,
      });

      if (error.message === CreateBattleErrors.SquadNotEligible) {
        return ctx.badRequest(CreateBattleErrors.SquadNotEligible);
      }

      throw error;
    }

    try {
      // TODO: Notifications should go into a service
      // Send out the notifications. These are non-crucial so no need to return errors

      if (invitedTeam) {
        await strapi
          .service("api::notification.notification")
          .createBattleInviteReceivedNotifications({
            battleId: createdBattleId,
            invitingTeamId: team.id,
            invitedTeamId: invitedTeam.id,
          });
      }

      await strapi
        .service("api::notification.notification")
        .createEnrolledInBattleNotification({
          battleId: createdBattleId,
          teamSelectionId: createdTeamSelectionId,
        });
    } catch (error) {}

    // TODO: have this just return a status code
    return strapi.service("api::battle.battle").findOne(createdBattleId);
  },
});
