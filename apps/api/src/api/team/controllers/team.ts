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
      const createdTeam = await super.create(ctx);

      // Get the profile making the request and create the founder
      const profile = await await strapi
        .service("api::profile.profile")
        .findOneByWalletAddress(ctx.state.wallet_address);

      if (!profile) {
        throw new errors.UnauthorizedError();
      }

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
        ctx
      );
      // Puts it in the data/meta format
      return this.transformResponse(sanitizedUpdatedCreatedTeam);
    },

    async invite(ctx) {
      /**
       * 1. Ensure the invites do not include a founder invite
       * 2. Ensure the requester has the correct permissions to invite people
       * 3. Filter out any invites for team members that already exist and create new team profiles
       */
      const query = await this.sanitizeQuery(ctx);
      const teamId = ctx.params.id;
      const { data: invites } = ctx.request.body ?? [];

      /**
       * Kind of makes sense to have this be:
       * - Fetch the team profile given the team and profile ID
       */

      const team = await strapi.service("api::team.team").findOne(teamId, {
        populate: {
          team_profiles: {
            populate: {
              profile: true,
            },
          },
        },
      });

      // 1.
      if (invites.some((invite) => invite.role === "founder")) {
        return ctx.badRequest("You cannot set a team member to be a founder");
      }

      const currentTeamProfiles = team.team_profiles ?? [];
      const existingProfileIds = currentTeamProfiles.map((tp) => tp.profile.id);

      const profile = await await strapi
        .service("api::profile.profile")
        .findOneByWalletAddress(ctx.state.wallet_address);

      const requesterTeamProfile = currentTeamProfiles.find(
        (rtp) => rtp.profile.id === profile.id
      );

      // 2.
      const requestersRole = requesterTeamProfile?.role;
      if (requestersRole === "member") {
        return ctx.badRequest(
          "You do not have permission to invite people to this team"
        );
      }

      if (
        invites.some((invite) => invite.role === "leader") &&
        requestersRole !== "founder"
      ) {
        return ctx.badRequest("Only founders can invite people to be leaders");
      }

      // 3.
      await Promise.all(
        invites
          .filter((invite) => !existingProfileIds.includes(invite.profile))
          .map(async ({ profile, role }) => {
            await strapi.service("api::team-profile.team-profile").create({
              data: {
                team: teamId,
                profile: profile,
                role,
                is_pending: true,
              },
            });
          })
      );

      const updatedCreatedTeam = await strapi
        .service("api::team.team")
        .findOne(teamId, query);

      const sanitizedUpdatedCreatedTeam = await this.sanitizeOutput(
        updatedCreatedTeam,
        ctx
      );

      return this.transformResponse(sanitizedUpdatedCreatedTeam);
    },
  })
);
