/**
 * team controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::team.team",
  ({ strapi }) => ({
    async create(ctx) {
      const walletAddress = ctx.state.wallet_address;
      const createdTeam = await super.create(ctx);

      // Get the profile making the request and create the founder
      const { results: profileResults } = await strapi
        .service("api::profile.profile")
        .find({ filters: { wallet_address: walletAddress } });

      const profile = profileResults[0];

      // Create the founder
      const teamProfile = await strapi
        .service("api::team-profile.team-profile")
        .create({
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
    update(ctx) {
      return super.update(ctx);
    },
  })
);
