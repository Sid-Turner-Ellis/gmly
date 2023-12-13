/**
 * notification router
 */

import { factories } from "@strapi/strapi";

export const sharedConfig = {
  middlewares: ["global::protected"],
};

export default factories.createCoreRouter("api::notification.notification", {
  config: {
    find: {
      ...sharedConfig,
    },
    update: {
      ...sharedConfig,
    },
  },
});