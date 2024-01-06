import { ethers } from "ethers";

export const cronTasks = {
  inviteExpiryJob: {
    async task({ strapi }) {
      // get the ISO string for the 24 hours ago, if the createdAt is less than this (lower than this), then it's expired
      const now = new Date();
      const expiredThreshold = new Date(now.getTime() - 23.5 * 60 * 60 * 1000); // 23 hours, 30 minutes ago

      const { results: expiredInvites } = await strapi.services[
        "api::team-profile.team-profile"
      ].find({
        filters: {
          $and: [
            {
              is_pending: true,
            },

            {
              createdAt: {
                $lt: expiredThreshold.toISOString(),
              },
            },
          ],
        },
      });

      await Promise.all(
        expiredInvites.map(async ({ id }) => {
          await strapi.service("api::team-profile.team-profile").delete(id);
        }),
      );
    },
    options: {
      rule: "0 * * * *", // start of every hour
    },
  },
  confirmTransactions: {
    async task({ strapi }) {
      // Make the request to the smart contract
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.JSON_RPC_URL,
      );
      await provider.ready;
      const { results: unconfirmedTransactions } = await strapi.services[
        "api::transaction.transaction"
      ].find({
        filters: {
          confirmed: false,
        },
      });

      await Promise.all(
        unconfirmedTransactions.map(async (transaction) => {
          if (!transaction.txHash) {
            return;
          }

          console.log(
            "found unconfirmed transaction: ",
            transaction.txHash,
            "checking...",
          );
          // errors here are crashing the server???
          const web3Transaction = await provider.getTransaction(
            transaction.txHash,
          );

          // TODO: this should be more like 180
          // What happens if we can't find a transaction because it was just created?
          if (web3Transaction.confirmations >= 1) {
            await strapi
              .service("api::transaction.transaction")
              .update(transaction.id, {
                data: {
                  confirmed: true,
                },
              });

            console.log("transaction has been comfirmed: ", transaction.txHash);
          }
        }),
      );
    },
    options: {
      rule: "* * * * *", // start of minute
    },
  },
};
