export const toUsdString = (amount: number) =>
  amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
