import { sharedConfig } from "./transaction";
import merge from "deepmerge";

const config = {
  middlewares: ["api::transaction.no-reentry"],
};

const mergedConfig = merge(sharedConfig, config);

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/transactions/deposit",
      handler: "transaction.deposit",
      config: mergedConfig,
    },
    {
      method: "POST",
      path: "/transactions/withdraw",
      handler: "transaction.withdraw",
      config: mergedConfig,
    },
  ],
};
