import { errors } from "@strapi/utils";
const { ApplicationError } = errors;

// TODO: Allow these to fail without causing errors as they are not critical

export default {
  beforeDeleteMany() {
    // throw new ApplicationError("Cannot delete many transactions");
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
    const initialTransaction = await strapi
      .service("api::transaction.transaction")
      .findOne(id);

    const initialConfirmValue = initialTransaction?.confirmed;
    const finalConfirmValue = data.confirmed ?? initialConfirmValue;

    const transactionWasConfirmed =
      initialConfirmValue === false && finalConfirmValue === true;

    if (transactionWasConfirmed) {
      await strapi.service("api::notification.notification").create({
        data: {
          type: "TRANSACTION_RESULT",
          transaction_result_details: {
            didFail: false,
            type: initialTransaction.type,
            amount: initialTransaction.amount,
          },
        },
      });
    }
  },
  async afterDelete({ result }) {
    await strapi.service("api::notification.notification").create({
      data: {
        type: "TRANSACTION_RESULT",
        transaction_result_details: {
          didFail: true,
          type: result.type,
          amount: result.amount,
        },
      },
    });
  },
};
