/**
 * team controller
 */

import { factories } from "@strapi/strapi";
import { errors } from "@strapi/utils";

export default factories.createCoreController(
  "api::team.team",
  ({ strapi }) => ({
    async delete(ctx) {
      // No need to sanitisze query because we're not returning data in a meaningful way (just confirmation its deleted)

      // Check if the user is a founder
      const profile = await strapi
        .service("api::profile.profile")
        .findOneByWalletAddress(ctx.state.wallet_address);

      const teamId = ctx.params.id;

      const founderTeamProfile = await strapi
        .service("api::team-profile.team-profile")
        .findFounderTeamProfile(teamId);

      if (founderTeamProfile.profile.id !== profile.id) {
        throw new errors.UnauthorizedError();
      }

      return super.delete(ctx);
    },

    async create(ctx) {
      // Get the profile making the request and create the founder
      const profile = await await strapi
        .service("api::profile.profile")
        .findOneByWalletAddress(ctx.state.wallet_address, {
          populate: {
            team_profiles: {
              populate: {
                team: {
                  populate: {
                    game: true,
                  },
                },
              },
            },
          },
        });

      const profileHasGamerTagForTeamsGame = await strapi
        .service("api::gamer-tag.gamer-tag")
        .doesProfileHaveGamerTagForGame(profile.id, ctx.request.body.data.game);

      if (!profileHasGamerTagForTeamsGame) {
        return ctx.badRequest(
          "You need a gamer tag for this game to create a team",
        );
      }

      const gameIdsProfileHasTeamsFor = profile.team_profiles.map(
        (tp) => tp.team.game.id,
      );

      if (gameIdsProfileHasTeamsFor.includes(ctx.request.body.data.game)) {
        return ctx.badRequest("You already have a team for this game");
      }

      // TODO: This isn't necessary as we have protected middleware on all routes
      if (!profile) {
        throw new errors.UnauthorizedError();
      }

      if (ctx.request.body.data.team_profiles) {
        return ctx.badRequest();
      }

      const createdTeam = await super.create(ctx);

      // Create the founder
      await strapi.service("api::team-profile.team-profile").create({
        data: {
          team: createdTeam.data.id,
          profile: profile.id,
          role: "founder",
          is_pending: false,
        },
      });

      const query = await this.sanitizeQuery(ctx);

      // Refetch the team and return (with the owner)
      const updatedCreatedTeam = await strapi
        .service("api::team.team")
        .findOne(createdTeam.data.id, query);

      const sanitizedUpdatedCreatedTeam = await this.sanitizeOutput(
        updatedCreatedTeam,
        ctx,
      );
      // Puts it in the data/meta format
      return this.transformResponse(sanitizedUpdatedCreatedTeam);
    },

    async leave(ctx) {
      // TODO: Don't allow them to leave if they have pending games
      const profile = await strapi
        .service("api::profile.profile")
        .findOneByWalletAddress(ctx.state.wallet_address);

      const teamProfile = await strapi
        .service("api::team-profile.team-profile")
        .findTeamProfileByProfileId(ctx.params.id, profile.id);

      // Don't allow the founder to leave
      if (teamProfile.role === "founder") {
        return ctx.badRequest("Founders can not leave");
      }

      return await strapi
        .service("api::team-profile.team-profile")
        .delete(teamProfile.id);
    },

    async bulkUpdateMembers(ctx) {
      const query = await this.sanitizeQuery(ctx);
      const teamId = ctx.params.id;
      const { data: teamMemberUpdates } = ctx.request.body ?? [];

      const teamBeforeUpdates = await strapi
        .service("api::team.team")
        .findOne(teamId, {
          populate: {
            team_profiles: {
              populate: {
                profile: true,
              },
            },
          },
        });

      const teamProfiles = teamBeforeUpdates.team_profiles ?? [];

      // Team profile is in the request data but not the original team
      const teamProfilesToCreate = teamMemberUpdates.filter(
        (tmu) => !teamProfiles.some((tp) => tp.profile.id === tmu.profile),
      );

      // Team profile is in the original team but not the request data
      const teamProfilesToDelete = teamProfiles
        .filter(
          (tp) =>
            !teamMemberUpdates.some((tmu) => tmu.profile === tp.profile.id),
        )
        .map((tp) => ({ id: tp.id, role: tp.role, profile: tp.profile.id }));

      const teamProfilesToUpdate = teamProfiles
        .map((tp) => {
          const teamMemberUpdate = teamMemberUpdates.find(
            (tmu) => tp.profile.id === tmu.profile,
          );

          if (teamMemberUpdate && teamMemberUpdate.role !== tp.role) {
            return {
              id: tp.id,
              role: teamMemberUpdate.role,
              profile: tp.profile.id,
            };
          }

          return false;
        })
        .filter(Boolean);

      const profile = await await strapi
        .service("api::profile.profile")
        .findOneByWalletAddress(ctx.state.wallet_address);

      if (!profile) {
        throw new errors.UnauthorizedError();
      }

      const requesterTeamProfile = teamProfiles.find(
        (tp) => tp.profile.id === profile.id,
      );

      const requestersRole = requesterTeamProfile?.role;

      const playersWereDeleted = teamProfilesToDelete.length > 0;
      const playersWereUpdated = teamProfilesToUpdate.length > 0;

      const updatesContainsLeader =
        teamProfilesToCreate.some((tptc) => tptc.role === "leader") ||
        teamProfilesToUpdate.some((tptu) => tptu.role === "leader") ||
        teamProfilesToDelete.some((tptd) => tptd.role === "leader");

      const numberOfFoundersInUpdates =
        teamProfilesToCreate.filter((tptc) => tptc.role === "founder").length +
        teamProfilesToUpdate.filter((tptu) => tptu.role === "founder");

      if (numberOfFoundersInUpdates > 1) {
        return ctx.badRequest("Only one founder is allowed");
      }

      if (requestersRole === "member") {
        throw new errors.UnauthorizedError();
      }

      if (
        requestersRole === "leader" &&
        (playersWereDeleted || playersWereUpdated || updatesContainsLeader)
      ) {
        throw new errors.UnauthorizedError();
      }

      // Apply creates
      await Promise.all(
        teamProfilesToCreate.map(async (teamProfileToCreate) => {
          await strapi.service("api::team-profile.team-profile").create({
            data: {
              team: teamId,
              profile: teamProfileToCreate.profile,
              role: teamProfileToCreate.role,
              is_pending: true,
              invited_by: profile.id,
            },
          });
        }),
      );

      // Apply updates
      await Promise.all(
        teamProfilesToUpdate.map(async ({ role, id }) => {
          await strapi.service("api::team-profile.team-profile").update(id, {
            data: {
              role,
            },
          });
        }),
      );

      // Apply deletes
      await Promise.all(
        teamProfilesToDelete.map(async ({ id }) => {
          await strapi.service("api::team-profile.team-profile").delete(id);
        }),
      );

      const refreshedTeam = await strapi
        .service("api::team.team")
        .findOne(teamId, query);

      const sanitizedRefreshedTeam = await this.sanitizeOutput(
        refreshedTeam,
        ctx,
      );

      return this.transformResponse(sanitizedRefreshedTeam);
    },
  }),
);
