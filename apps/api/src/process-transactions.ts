import { ethers } from "ethers";
import { getEthersProvider, getGamerlyContract } from "./eth-utils";

// TODO: replace txBlockNumber and txHash with onChainSince

const isDev = process.env.NEXT_PUBLIC_APP_ENV === "development";
const isStage = process.env.NEXT_PUBLIC_APP_ENV === "staging";

export const processTransactions = async (currentBlockNumber: number) => {
  const unconfirmedTransactions = await strapi
    .service("api::transaction.transaction")
    .find({
      filters: {
        confirmed: false,
      },
      pagination: {
        pageSize: 1,
      },
    });

  if (unconfirmedTransactions.results.length === 0) {
    return;
  }
  // Transaction creation
  const gasLimit = ethers.BigNumber.from(500000);
  const gamerlyContract = await getGamerlyContract();
  const requiredConfirmations = {
    allowance: isDev ? 1 : isStage ? 5 : 10,
    transaction: isDev ? 2 : isStage ? 10 : 180,
    deletion: isDev ? 3 : isStage ? 20 : 200,
  };

  console.log("----- creating transactions -----");
  const depositTransactionsToCreate = await strapi
    .service("api::transaction.transaction")
    .find({
      filters: {
        type: "deposit",
        confirmed: false,
        txHash: { $null: true },
        onChainSinceBlockNumber: { $null: true },
        allowanceTxBlockNumber: {
          $lte: currentBlockNumber - requiredConfirmations.allowance,
        },
      },
      populate: {
        profile: true,
      },
      pagination: {
        pageSize: 250,
      },
    });
  console.log(
    "deposit transactions to create",
    depositTransactionsToCreate.results,
  );

  await Promise.all(
    depositTransactionsToCreate.results.map(async (result) => {
      try {
        // TODO: If this wait takes too long, we can just start saving the current block number
        const tx = await (
          await gamerlyContract.deposit(
            result.id,
            result.amount * 10000,
            result.profile.wallet_address,
            {
              gasLimit,
            },
          )
        ).wait();
        console.log("about to update");
        console.log(result, tx);
        await strapi.service("api::transaction.transaction").update(result.id, {
          data: {
            txHash: tx.transactionHash,
            txBlockNumber: tx.blockNumber,
          },
        });
        console.log("completed update");

        console.log("created deposit transaction", result.id);
      } catch (error) {
        console.log("error creating deposit transaction", error);
      }
    }),
  );

  console.log("----- confirming transactions -----");

  // Transaction confirmation
  // TODO: This page size limit could become restrictive
  const transactionsToConfirm = await strapi
    .service("api::transaction.transaction")
    .find({
      pagination: {
        pageSize: 250,
      },
      populate: {
        profile: true,
      },
      filters: {
        confirmed: false,
        type: ["deposit", "withdraw"],
        $or: [
          {
            txBlockNumber: {
              $lte: currentBlockNumber - requiredConfirmations.transaction,
            },
          },
          {
            onChainSinceBlockNumber: {
              $lte: currentBlockNumber - requiredConfirmations.transaction,
            },
          },
        ],
      },
    });

  console.log("transactions to confirm", transactionsToConfirm.results);

  await Promise.all(
    transactionsToConfirm.results.map(async (result) => {
      try {
        // Note that we don't need to check the receipt here because if the transaction is on the blockchain after X confirmations we know it's valid
        const onChainTransaction = await gamerlyContract.getTransaction(
          result.id,
        );

        if (onChainTransaction) {
          const { amount, profileAddress, transactionType } =
            onChainTransaction;

          const transactionTypeMatches =
            result.type === "deposit"
              ? transactionType === 0
              : transactionType === 1;

          const amountMatches =
            ethers.BigNumber.isBigNumber(amount) &&
            amount.eq(result.amount * 10000);

          const profileMatches =
            profileAddress.toLowerCase() ===
            result.profile.wallet_address.toLowerCase();

          await strapi
            .service("api::transaction.transaction")
            .update(result.id, {
              data: {
                confirmed: true,
              },
            });

          console.log(
            "should confirm transaction",
            transactionTypeMatches,
            amountMatches,
            profileMatches,
          );
          if (transactionTypeMatches && amountMatches && profileMatches) {
            await strapi
              .service("api::transaction.transaction")
              .update(result.id, {
                data: {
                  confirmed: true,
                },
              });
          }
        }
      } catch (error) {
        console.log("error confirming transaction", error);
      }
    }),
  );
  console.log("----- deleting transactions -----");
  // Transaction deletion
  const transactionsToDelete = await strapi
    .service("api::transaction.transaction")
    .find({
      pagination: {
        pageSize: 250,
      },
      filters: {
        confirmed: false,
        $or: [
          {
            txHash: { $null: true },
            txBlockNumber: { $null: true },
            onChainSinceBlockNumber: { $null: true },
            allowanceTxBlockNumber: {
              $lte: currentBlockNumber - requiredConfirmations.deletion,
            },
          },
          {
            txBlockNumber: {
              $lte: currentBlockNumber - requiredConfirmations.deletion,
            },
          },
          {
            onChainSinceBlockNumber: {
              $lte: currentBlockNumber - requiredConfirmations.deletion,
            },
          },
        ],
      },
    });

  console.log("transactions to delete", transactionsToDelete.results);

  await Promise.all(
    transactionsToDelete.results.map(async (result) => {
      const gamerlyContract = await getGamerlyContract();

      const onChainTransaction = await gamerlyContract.getTransaction(
        result.id,
      );

      if (!onChainTransaction) {
        console.log(
          "about to delete a transaction",
          result,
          onChainTransaction,
        );
        await strapi.service("api::transaction.transaction").delete(result.id);
      } else {
        console.log(
          "cannot delete - updating on chain since block number and setting the props",
          result.id,
        );
        const { amount, profileAddress, transactionType } = onChainTransaction;
        console.log(amount, profileAddress, transactionType);
        const profile = await strapi
          .service("api::profile.profile")
          .findOneByWalletAddress(profileAddress);

        // TODO: Start doing this validation in the confirm block instead
        console.log({
          onChainSinceBlockNumber: currentBlockNumber,
          transactionType: transactionType === 0 ? "deposit" : "withdraw",
          profile: profile.id,
          amount: amount.div(10000).toNumber(),
        });
        const res = await strapi
          .service("api::transaction.transaction")
          .update(result.id, {
            data: {
              onChainSinceBlockNumber: currentBlockNumber,
              type: transactionType === 0 ? "deposit" : "withdraw",
              profile: profile.id,
              amount: amount.div(10000).toNumber(),
            },
          });

        console.log("res", res);
      }
    }),
  );
};
