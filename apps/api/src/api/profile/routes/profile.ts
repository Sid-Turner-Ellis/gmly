/**
 * profile router
 */

import { factories } from "@strapi/strapi";

export const sharedConfig = {
  middlewares: ["global::wallet-guard"],
};

export default factories.createCoreRouter("api::profile.profile", {
  config: {
    update: {
      ...sharedConfig,
    },
    find: {
      ...sharedConfig,
    },
    findOne: {
      ...sharedConfig,
    },
    create: {
      ...sharedConfig,
    },
    delete: {
      ...sharedConfig,
    },
  },
});
