/**
 * transaction service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::transaction.transaction",
  ({ strapi }) => ({}),
);
