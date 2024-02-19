// The data in beforeCreate/update hooks varies based on whether the request was made via the API or the Admin UI
export const resolveRelationIdForHookData = (
  data: number | { connect: { id: number }[] },
) => {
  if (typeof data === "number") {
    return data;
  }
  return data.connect[0]?.id;
};
