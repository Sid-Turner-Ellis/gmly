/**
 * transaction controller
 */

import { RequestContext, factories } from "@strapi/strapi";
import { ethers } from "ethers";
import { getEthersProvider, getGamerlyContract } from "../../../eth-utils";

const getBadRequestMessage = async (
  profileId: number,
  amount: number,
): Promise<string | null> => {
  if (amount <= 0) {
    return "Amount must be greater than 0";
  }

  if (amount % 1 !== 0) {
    return "Amount must be a whole number";
  }

  const pendingTransactionsForProfile = await strapi
    .service("api::transaction.transaction")
    .find({
      pagination: {
        pageSize: 1,
      },
      filters: {
        profile: profileId,
        confirmed: false,
      },
    });

  if (pendingTransactionsForProfile.results.length > 0) {
    return "You already have a pending transaction, please wait for it to be confirmed";
  }

  return null;
};

export default factories.createCoreController(
  "api::transaction.transaction",
  ({ strapi }) => ({
    async deposit(ctx) {
      const { amount } = ctx.request.body?.data || { amount: 0 };

      const profile = await strapi
        .service("api::profile.profile")
        .findOneByWalletAddress(ctx.state.wallet_address);

      const badRequestMessage = await getBadRequestMessage(profile.id, amount);

      if (badRequestMessage) {
        return ctx.badRequest(badRequestMessage);
      }

      const provider = await getEthersProvider();
      const currentBlockNumber = await provider.getBlockNumber();

      await strapi.service("api::transaction.transaction").create({
        data: {
          amount,
          profile: profile.id,
          type: "deposit",
          confirmed: false,
          allowanceTxBlockNumber: currentBlockNumber,
        },
      });

      ctx.response.status = 200;
    },

    async withdraw(ctx) {
      const { amount } = ctx.request.body?.data || { amount: 0 };

      const profile = await strapi
        .service("api::profile.profile")
        .findOneByWalletAddress(ctx.state.wallet_address);

      const badRequestMessage = await getBadRequestMessage(profile.id, amount);

      if (badRequestMessage) {
        return ctx.badRequest(badRequestMessage);
      }

      const newlyCreatedTransaction = await strapi
        .service("api::transaction.transaction")
        .create({
          data: {
            amount: amount,
            profile: profile.id,
            type: "withdraw",
            confirmed: false,
          },
        });

      const gasLimit = 500000;

      try {
        const gamerlyContract = await getGamerlyContract();
        const tx = await (
          await gamerlyContract.withdraw(
            newlyCreatedTransaction.id,
            ctx.state.wallet_address,
            amount * 1000000,
            {
              gasLimit: ethers.BigNumber.from(gasLimit),
            },
          )
        ).wait();

        await strapi
          .service("api::transaction.transaction")
          .update(newlyCreatedTransaction.id, {
            data: {
              txHash: tx.transactionHash,
              txBlockNumber: tx.blockNumber,
            },
          });
      } catch (error) {}

      ctx.response.status = 200;
    },
  }),
);
