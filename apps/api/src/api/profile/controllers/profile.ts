/**
 * profile controller
 *
 * Can be overriden here:
 * https://github.com/strapi/strapi/blob/main/packages/core/strapi/src/core-api/controller/collection-type.ts#L16
 */

import { factories } from "@strapi/strapi";
import { errors } from "@strapi/utils";

export default factories.createCoreController(
  "api::profile.profile",
  ({ strapi }) => ({
    async update(ctx) {
      const id = ctx.params.id;

      const requestData = ctx.request.body.data ?? {};
      const fieldsToUpdate = Object.keys(requestData);

      if (fieldsToUpdate.includes("wallet_address")) {
        ctx.badRequest("Cannot update wallet address");
        return;
      }

      const { wallet_address, username, social_links } = await strapi
        .service("api::profile.profile")
        .findOne(id, { populate: { social_links: true } });

      if (wallet_address !== ctx.state.wallet_address) {
        throw new errors.UnauthorizedError();
      }

      if (fieldsToUpdate.includes("username") && username) {
        ctx.badRequest("Cannot update username if already set");
        return;
      }

      if (requestData.bio?.length > 248) {
        return ctx.badRequest("Bio cannot be longer than 248 characters");
      }

      if (requestData.social_links) {
        const { id, ...existingSocialLinks } = social_links;
        const updatedSocialLinks = {
          ...existingSocialLinks,
          ...requestData.social_links,
        };
        ctx.request.body.data.social_links = updatedSocialLinks;
      }

      const { data, meta } = await super.update(ctx);

      // TODO: Sanitise and transform properly
      return { data, meta };
    },
  }),
);
