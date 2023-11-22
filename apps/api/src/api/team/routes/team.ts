/**
 * team router
 */

import { factories } from "@strapi/strapi";

const sharedConfig = {
  middlewares: ["global::protected"],
};

export default factories.createCoreRouter("api::team.team", {
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
