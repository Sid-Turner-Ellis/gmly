/**
 * transaction router
 */

import { factories } from "@strapi/strapi";

export const sharedConfig = {
  middlewares: ["global::protected"],
};

export default factories.createCoreRouter("api::transaction.transaction", {
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
