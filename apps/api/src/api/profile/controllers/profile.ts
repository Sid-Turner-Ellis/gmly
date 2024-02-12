/**
 * profile controller
 *
 * Can be overriden here:
 * https://github.com/strapi/strapi/blob/main/packages/core/strapi/src/core-api/controller/collection-type.ts#L16
 */

import { factories } from "@strapi/strapi";
import { errors } from "@strapi/utils";
import { z } from "zod";

const profileUpdateSchema = z
  .object({
    region: z.string(),
    username: z.string().max(20),
    wager_mode: z.boolean(),
    avatar: z.number(),
    bio: z.string().max(248),
    trust_mode: z.boolean(),
    social_links: z
      .object({
        discord: z.string().nullable(),
        twitter: z.string().nullable(),
        twitch: z.string().nullable(),
        youtube: z.string().nullable(),
      })
      .partial(),
  })
  .partial();

export default factories.createCoreController(
  "api::profile.profile",
  ({ strapi }) => ({
    async find(ctx) {
      // console.log("state", ctx.state);
      return super.find(ctx);
    },
    async update(ctx) {
      const id = ctx.params.id;
      const parseRequestDataResult = profileUpdateSchema.safeParse(
        ctx.request.body.data,
      );

      if (!parseRequestDataResult.success) {
        return ctx.badRequest();
      }

      const parsedRequestData = parseRequestDataResult.data;
      ctx.request.body.data = parsedRequestData;

      const { wallet_address, username, social_links } = await strapi
        .service("api::profile.profile")
        .findOne(id, { populate: { social_links: true } });

      if (wallet_address !== ctx.state.wallet_address) {
        throw new errors.UnauthorizedError();
      }

      if (parsedRequestData.username && username) {
        ctx.badRequest("Cannot update username if already set");
        return;
      }

      if (parsedRequestData.social_links) {
        const { id, ...existingSocialLinks } = social_links ?? {};
        const updatedSocialLinks = {
          ...existingSocialLinks,
          ...parsedRequestData.social_links,
        };
        ctx.request.body.data.social_links = updatedSocialLinks;
      }

      return super.update(ctx);
    },
  }),
);
