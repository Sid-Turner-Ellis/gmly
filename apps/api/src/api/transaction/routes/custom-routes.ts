import { sharedConfig } from "./transaction";
module.exports = {
  routes: [
    {
      method: "POST",
      path: "/transactions/deposit",
      handler: "transaction.deposit",
      config: {
        ...sharedConfig,
      },
    },
    {
      method: "POST",
      path: "/transactions/withdraw",
      handler: "transaction.withdraw",
      config: {
        ...sharedConfig,
      },
    },
  ],
};
