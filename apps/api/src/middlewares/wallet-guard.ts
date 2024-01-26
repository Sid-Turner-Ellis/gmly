/**
 * `wallet-guard` middleware
 */

import { Strapi } from "@strapi/strapi";
import { errors } from "@strapi/utils";

export default (config, { strapi }: { strapi: Strapi }) => {
  return async (ctx, next) => {
    const walletAddress = ctx.state.wallet_address;

    if (!walletAddress) {
      throw new errors.UnauthorizedError();
    }
    return next();
  };
};
