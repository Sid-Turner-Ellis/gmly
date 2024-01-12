/**
 * 
 * @param profileIdOrProfileIds 
 * @returns 
   [
     {
       amount: number, // meaningless
       confirmedBalance: number, // the sum of all confirmed transaction amounts
       type: "withdraw", // we group by transaction type
       profileId: 1, // we group by profile ID too
     },
     {
       amount: number,
       confirmedBalance: number,
       type: "in",
       profileId: 1,
     },
     {
       amount: number, // meaningless
       confirmedBalance: number, // the sum of all confirmed transaction amounts
       type: "withdraw", // we group by transaction type
       profileId: 2, // we group by profile ID too
     },
   ];
 */
const getSumOfTransactionsByTypeAndProfileId = async (
  profileIdOrProfileIds: number | number[],
) => {
  const knex = strapi.db.connection;
  const query = knex("transactions")
    .join(
      "transactions_profile_links",
      "transactions.id",
      "=",
      "transactions_profile_links.transaction_id",
    )
    .select(
      "transactions.amount as amount",
      "transactions.type as type",
      "transactions_profile_links.profile_id as profileId",
    )
    .where({ confirmed: true })
    .orWhere({ type: "withdraw" }) // we assume that withdrawals are always confirmed to be safe
    .groupBy("type")
    .sum("amount as confirmedBalance");

  if (Array.isArray(profileIdOrProfileIds)) {
    query.groupBy("profileId");
    query.whereIn("profileId", profileIdOrProfileIds);
  } else {
    query.where({ profileId: profileIdOrProfileIds });
  }

  return await query;
};

const calculateBalanceForProfile = (
  profileId: number,
  sumOfTransactionsByType: any[],
) => {
  const transactionsForProfile = sumOfTransactionsByType.filter(
    (t) => t.profileId === profileId,
  );

  const withdrawSum =
    transactionsForProfile.find(({ type }) => type === "withdraw")
      ?.confirmedBalance ?? 0;

  const depositSum =
    transactionsForProfile.find(({ type }) => type === "deposit")
      ?.confirmedBalance ?? 0;

  const outSome =
    transactionsForProfile.find(({ type }) => type === "out")
      ?.confirmedBalance ?? 0;

  const inSum =
    transactionsForProfile.find(({ type }) => type === "in")
      ?.confirmedBalance ?? 0;

  const totalBalance = depositSum + inSum - (withdrawSum + outSome);

  return totalBalance;
};

export default {
  async beforeCreate(event) {
    event.params.data.balance = 0;
  },
  async beforeCreateMany(event) {
    event.params.data.forEach((profile) => {
      profile.balance = 0;
    });
  },
  async beforeUpdateMany(event) {
    event.params.data.forEach((profile) => {
      profile.balance = 0;
    });
  },
  async beforeUpdate(event) {
    event.params.data.balance = 0;
  },
  async afterFindOne(event) {
    const shouldCalculateBalance =
      event?.result && Object.keys(event.result).includes("balance");

    if (shouldCalculateBalance) {
      const profileId = event.result.id;

      const transactionSums =
        await getSumOfTransactionsByTypeAndProfileId(profileId);

      const totalBalance = calculateBalanceForProfile(
        profileId,
        transactionSums,
      );

      event.result.balance = totalBalance;
    }
  },
  async afterFindMany(event) {
    const profileIds = event?.result.map(({ id }) => id);
    const shouldCalculateBalance =
      event?.result[0] && Object.keys(event.result[0]).includes("balance");

    if (shouldCalculateBalance) {
      const transactionSums =
        await getSumOfTransactionsByTypeAndProfileId(profileIds);

      event.result.forEach((profile) => {
        const totalBalance = calculateBalanceForProfile(
          profile.id,
          transactionSums,
        );
        profile.balance = totalBalance;
      });
    }
  },
};
