import { ethers } from "ethers";
import {
  getEthersProvider,
  getGamerlyContract,
  getGamerlyTransactionData,
} from "./eth-utils";

const processTransactions = async (currentBlockNumber: number) => {
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
  const provider = await getEthersProvider();
  const gamerlyContract = await getGamerlyContract();
  const requiredConfirmations = {
    allowance: 10,
    transaction: 180,
    deletion: 200,
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
            result.profile.wallet_address,
            result.amount * 1000000,
            {
              gasLimit,
            },
          )
        ).wait();

        await strapi.service("api::transaction.transaction").update(result.id, {
          data: {
            txHash: tx.transactionHash,
            txBlockNumber: tx.blockNumber,
          },
        });

        console.log("created deposit transaction", result.id);
      } catch (error) {
        const errorData = error?.data || error?.error?.data;

        console.log("error creating deposit transaction", errorData);
        if (errorData) {
          const errorName = gamerlyContract.interface.parseError(
            errorData.data,
          ).name;

          if (errorName === "TransactionIdAlreadyExists") {
            console.log("transaction already exists", result.id);
            await strapi
              .service("api::transaction.transaction")
              .update(result.id, {
                data: {
                  onChainSinceBlockNumber: currentBlockNumber,
                },
              });
          }
        }
      }
    }),
  );

  console.log("----- confirming transactions -----");

  // Transaction confirmation
  const transactionsToConfirm = await strapi
    .service("api::transaction.transaction")
    .find({
      pagination: {
        pageSize: 250,
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
        let shouldConfirm = false;
        if (result.txHash) {
          const tx = await provider.getTransaction(result.txHash);
          const txData = getGamerlyTransactionData(tx.data);
          // TODO: start validating the web2 and web3 transactions match
          shouldConfirm = true;
        } else if (result.onChainSinceBlockNumber) {
          // Confirm they are still on the chain
          const onChainTransaction = await gamerlyContract.getTransaction(
            result.id,
          );

          if (onChainTransaction.valid) {
            shouldConfirm = true;
          }
        }

        console.log("should confirm transaction", shouldConfirm, result.id);
        if (shouldConfirm) {
          await strapi
            .service("api::transaction.transaction")
            .update(result.id, {
              data: {
                confirmed: true,
              },
            });
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

      if (!onChainTransaction.valid) {
        console.log(
          "about to delete a transaction",
          result,
          onChainTransaction,
        );
        await strapi.service("api::transaction.transaction").delete(result.id);
      } else {
        console.log(
          "cannot delete - updating on chain since block number",
          result.id,
        );
        await strapi.service("api::transaction.transaction").update(result.id, {
          data: {
            onChainSinceBlockNumber: currentBlockNumber,
          },
        });
      }
    }),
  );
};

export default {
  register(/*{ strapi }*/) {},
  async bootstrap({ strapi }) {
    console.log("bootstraping....");
    const apiModels = strapi.db.config.models.filter(
      ({ uid }) => typeof uid == "string" && uid.startsWith("api::"),
    );

    const apiModelNames = apiModels.map(({ uid }) => uid);

    console.log(apiModelNames);

    const provider = await getEthersProvider();

    const processInterval = 15;
    let nextBlockToProcess = (await provider.getBlockNumber()) + 30;
    let isProcessing = false;

    provider.on("block", async (blockNumber) => {
      // console.log("new block", {
      //   isProcessing,
      //   blockNumber,
      //   nextBlockToProcess,
      // });

      if (blockNumber < nextBlockToProcess || isProcessing) {
        return;
      }
      console.log("new block is being processed");
      nextBlockToProcess = blockNumber + processInterval;
      isProcessing = true;

      await processTransactions(blockNumber);

      isProcessing = false;
    });
  },
};
