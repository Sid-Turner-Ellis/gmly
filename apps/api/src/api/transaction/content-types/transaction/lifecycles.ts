import { errors } from "@strapi/utils";
const { ApplicationError } = errors;

export default {
  beforeDeleteMany() {
    throw new ApplicationError("Cannot delete many transactions");
  },
  beforeUpdateMany() {
    throw new ApplicationError("Cannot update many transactions");
  },
  async beforeUpdate({ params: { data } }) {
    console.log("afterUpdate", data);
    const initialTransaction = await strapi
      .service("api::transaction.transaction")
      .findOne(data.id);

    const initialConfirmValue = initialTransaction.confirmed;
    const finalConfirmValue = data.confirmed;

    const transactionWasConfirmed =
      initialConfirmValue === false && finalConfirmValue === true;

    if (transactionWasConfirmed) {
      await strapi.service("api::notification.notification").create({
        data: {
          type: "TRANSACTION_SUCCEEDED",
          transaction_data: {
            type: initialTransaction.type,
            amount: initialTransaction.amount,
          },
        },
      });
    }
  },
  afterCreate() {},
  async afterDelete({ result }) {
    console.log("afterDelete", result);

    await strapi.service("api::notification.notification").create({
      data: {
        type: "TRANSACTION_FAILED",
        transaction_data: {
          type: result.type,
          amount: result.amount,
        },
      },
    });
  },
};
