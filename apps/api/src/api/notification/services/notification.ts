/**
 * notification service
 */

import { factories } from "@strapi/strapi";

// TEAM_INVITE_RECEIVED
// TRANSACTION_RESULT
// ENROLLED_IN_BATTLE
// BATTLE_INVITE_RECEIVED

export default factories.createCoreService("api::notification.notification", {
  async createTeamInviteReceivedNotification(teamId, profileId) {
    throw new Error("Not implemented");
  },
  async createTransactionResultNotification(
    profileId,
    transactionResultDetails,
  ) {
    throw new Error("Not implemented");
  },
  async createBattleInviteReceivedNotifications({
    battleId,
    invitingTeamId,
    invitedTeamId,
  }: {
    battleId: number;
    invitingTeamId: number;
    invitedTeamId: number;
  }) {
    const invitingTeam = await strapi
      .service("api::team.team")
      .findOne(invitingTeamId);

    const invitedTeam = await strapi
      .service("api::team.team")
      .findOne(invitedTeamId, {
        populate: {
          image: true,
          team_profiles: {
            populate: {
              profile: true,
            },
            filters: {
              role: {
                $in: ["founder", "leader"],
              },
            },
          },
        },
      });

    // image.formats.thumbnail.url;
    const profilesToNotify = invitedTeam?.team_profiles?.map(
      (tp) => tp.profile.id,
    );

    const battleInviteReceivedNotifications = profilesToNotify.map(
      (profileId) => ({
        type: "BATTLE_INVITE_RECEIVED",
        profile: profileId,
        battle_invite_received_details: {
          battleId,
          invitedTeamId,
          invitingTeamId,
          invitingTeamName: invitingTeam?.name,
        },
      }),
    );

    await Promise.all(
      battleInviteReceivedNotifications.map((n) =>
        super.create({
          data: n,
        }),
      ),
    );
  },
  async createEnrolledInBattleNotification({
    battleId,
    teamSelectionId,
  }: {
    battleId: number;
    teamSelectionId: number;
  }) {
    const teamSelection = await strapi
      .service("api::team-selection.team-selection")
      .findOne(teamSelectionId, {
        populate: {
          team_selection_profiles: {
            filters: {
              is_captain: {
                $eq: false,
              },
            },
            populate: {
              team_profile: {
                populate: {
                  team: true,
                  profile: true,
                },
              },
            },
          },
        },
      });

    const profilesToNotify = teamSelection.team_selection_profiles.map(
      (teamSelectionProfile) => teamSelectionProfile.team_profile.profile.id,
    );

    const team = teamSelection.team_selection_profiles[0].team_profile.team;

    const enrolledInBattleNotifications = profilesToNotify.map((profileId) => ({
      type: "ENROLLED_IN_BATTLE",
      profile: profileId,
      enrolled_in_battle_details: {
        battleId,
        teamId: team.id,
      },
    }));

    await Promise.all(
      enrolledInBattleNotifications.map((n) => super.create({ data: n })),
    );
  },
});
