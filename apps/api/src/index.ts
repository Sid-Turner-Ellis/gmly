import { getEthersProvider } from "./eth-utils";
import { processTransactions } from "./process-transactions";

const isDev = process.env.NEXT_PUBLIC_APP_ENV === "development";
const isStage = process.env.NEXT_PUBLIC_APP_ENV === "staging";

export default {
  register(/*{ strapi }*/) {},
  async bootstrap({ strapi }) {
    console.log("bootstraping....");

    return;

    const apiModels = strapi.db.config.models.filter(
      ({ uid }) => typeof uid == "string" && uid.startsWith("api::"),
    );

    const apiModelNames = apiModels.map(({ uid }) => uid);

    console.log(apiModelNames);

    const provider = await getEthersProvider();

    const processInterval = isDev ? 1 : isStage ? 5 : 10;
    let nextBlockToProcess =
      (await provider.getBlockNumber()) + (isDev ? 1 : isStage ? 15 : 30);
    let isProcessing = false;

    provider.on("block", async (blockNumber) => {
      console.log("new block", isProcessing, blockNumber, nextBlockToProcess);

      if (blockNumber < nextBlockToProcess || isProcessing) {
        return;
      }
      console.log("new block is being processed!");
      nextBlockToProcess = blockNumber + processInterval;
      isProcessing = true;

      try {
        await processTransactions(blockNumber);
      } catch (error) {
        console.log("process transactions error", error);
      }

      isProcessing = false;
    });
  },
};
