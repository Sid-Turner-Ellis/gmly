/**
 * battle router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::battle.battle", {
  config: {
    find: {},
    findOne: {},
    create: {
      policies: ["global::is-admin"],
    },
    update: {
      policies: ["global::is-admin"],
    },
  },
});
