import { errors } from "@strapi/utils";
const { ApplicationError } = errors;

// TODO: Allow these to fail without causing errors as they are not critical

export default {
  beforeDeleteMany() {
    throw new ApplicationError("Cannot delete many transactions");
  },
  beforeUpdateMany() {
    throw new ApplicationError("Cannot update many transactions");
  },

  async beforeUpdate({
    params: {
      data,
      where: { id },
    },
  }) {
    // TODO: Need to make sure this logic isn't used for already IN | OUT transactions
    const initialTransaction = await strapi
      .service("api::transaction.transaction")
      .findOne(id, { populate: { profile: true } });

    const initialConfirmValue = initialTransaction?.confirmed;
    const finalConfirmValue = data.confirmed ?? initialConfirmValue;

    const transactionWasConfirmed =
      initialConfirmValue === false && finalConfirmValue === true;

    if (transactionWasConfirmed) {
      await strapi.service("api::notification.notification").create({
        data: {
          type: "TRANSACTION_RESULT",
          profile: initialTransaction.profile.id,
          transaction_result_details: {
            didFail: false,
            type: initialTransaction.type,
            amount: initialTransaction.amount,
          },
        },
      });
    }
  },

  async beforeDelete({
    state,
    params: {
      where: { id },
    },
  }) {
    const transactionToDelete = await strapi
      .service("api::transaction.transaction")
      .findOne(id, { populate: { profile: true } });

    state.profileId = transactionToDelete.profile.id;
  },
  async afterDelete({ result, state }) {
    await strapi.service("api::notification.notification").create({
      data: {
        type: "TRANSACTION_RESULT",
        profile: state.profileId,
        transaction_result_details: {
          didFail: true,
          type: result.type,
          amount: result.amount,
        },
      },
    });
  },
};
