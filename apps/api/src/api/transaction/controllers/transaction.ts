/**
 * transaction controller
 */

import { factories } from "@strapi/strapi";
import { ethers } from "ethers";

const gamerlyAbi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "transactionId",
        type: "string",
      },
      {
        internalType: "address",
        name: "profileAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "readSomething",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "transactionId",
        type: "string",
      },
      {
        internalType: "address",
        name: "profileAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "something",
        type: "string",
      },
    ],
    name: "writeSomething",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// TODO: i'll put the setup ethers in bootstrap and then attach it to context or something
export default factories.createCoreController(
  "api::transaction.transaction",
  ({ strapi }) => ({
    async deposit(ctx) {
      const { amount } = ctx.request.body?.data || { amount: 0 };

      if (amount <= 0) {
        return ctx.badRequest("Amount must be greater than 0");
      }

      const profile = await await strapi
        .service("api::profile.profile")
        .findOneByWalletAddress(ctx.state.wallet_address);

      // create the new transaction record
      const newlyCreatedTransaction = await strapi
        .service("api::transaction.transaction")
        .create({
          data: {
            amount,
            profile: profile.id,
            type: "deposit",
            confirmed: false,
          },
        });

      // Make the request to the smart contract
      const provider = new ethers.providers.JsonRpcProvider(
        "https://30fa-138-199-53-241.ngrok-free.app",
      );
      await provider.ready;

      const ownerWallet = new ethers.Wallet(
        "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        provider,
      );

      const gamerlyContract = new ethers.Contract(
        "0x9DBb24B10502aD166c198Dbeb5AB54d2d13AfcFd",
        gamerlyAbi,
      );

      const connectedGamerlyContract = gamerlyContract.connect(ownerWallet);

      // TODO: will use a gas reporter to estimate this better
      const gasLimit = 500000;

      try {
        // TODO: Start storing the transaction hash in the transaction
        const receipt = await connectedGamerlyContract.deposit(
          newlyCreatedTransaction.id.toString(),
          ctx.state.wallet_address,
          amount * 1000000,
          {
            gasLimit: ethers.BigNumber.from(gasLimit),
          },
        );
        const txHash = receipt.hash;

        await strapi
          .service("api::transaction.transaction")
          .update(newlyCreatedTransaction.id, {
            data: {
              txHash,
            },
          });
      } catch (error) {
        await strapi
          .service("api::transaction.transaction")
          .delete(newlyCreatedTransaction.id);

        throw error;
      }

      return Promise.resolve(true);
    },

    async withdraw(ctx) {
      const { amount } = ctx.request.body?.data || { amount: 0 };

      // TODO: check no pending withdrawals and balance

      const profile = await await strapi
        .service("api::profile.profile")
        .findOneByWalletAddress(ctx.state.wallet_address);

      // create the new transaction record
      //   TODO: I reckon we should normalise the amount of decimal places as it will cause a mismatch
      // happy to put this in the contract tbh.
      const newlyCreatedTransaction = await strapi
        .service("api::transaction.transaction")
        .create({
          data: {
            amount,
            profile: profile.id,
            type: "withdraw",
            confirmed: false,
          },
        });

      // Make the request to the smart contract
      const provider = new ethers.providers.JsonRpcProvider(
        "https://30fa-138-199-53-241.ngrok-free.app",
      );
      await provider.ready;

      const ownerWallet = new ethers.Wallet(
        "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        provider,
      );

      const gamerlyContract = new ethers.Contract(
        "0x9DBb24B10502aD166c198Dbeb5AB54d2d13AfcFd",
        gamerlyAbi,
      );

      const connectedGamerlyContract = gamerlyContract.connect(ownerWallet);

      const gasLimit = 500000;

      try {
        const receipt = await connectedGamerlyContract.withdraw(
          newlyCreatedTransaction.id.toString(),
          ctx.state.wallet_address,
          amount * 1000000,
          {
            gasLimit: ethers.BigNumber.from(gasLimit),
          },
        );

        const txHash = receipt.hash;

        await strapi
          .service("api::transaction.transaction")
          .update(newlyCreatedTransaction.id, {
            data: {
              txHash,
            },
          });
      } catch (error) {
        await strapi
          .service("api::transaction.transaction")
          .delete(newlyCreatedTransaction.id);

        throw error;
      }

      return Promise.resolve(true);
    },
  }),
);
