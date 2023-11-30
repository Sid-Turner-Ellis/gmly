/**
 * profile service
 */

import { factories } from "@strapi/strapi";
import merge from "deepmerge";

export default factories.createCoreService("api::profile.profile", {
  async findOneByWalletAddress(walletAddress, params: any = {}) {
    const mergedParams = merge(params, {
      filters: {
        wallet_address: walletAddress,
      },
    });
    const { results: profileResults } = await strapi
      .service("api::profile.profile")
      .find(mergedParams);

    const profile = profileResults[0];

    return profile;
  },
});
