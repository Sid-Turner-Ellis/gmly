/**
 * team service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::team.team", {
  //   getProfileByWalletAddress: async (walletAddress) => {
  //     if (!walletAddress) {
  //       return null;
  //     }
  //     const { results } = await strapi
  //       .service("api::profile.profile")
  //       .find({ filters: { wallet_address: walletAddress } });
  //     const { results: profileResults } = await strapi
  //       .service("api::profile.profile")
  //       .find({ filters: { wallet_address: walletAddress } });
  //     const profile = profileResults[0];
  //   },
});
