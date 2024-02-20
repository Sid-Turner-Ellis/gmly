module.exports = {
  routes: [
    {
      method: "POST",
      path: "/battles/create/:teamProfileId",
      handler: "battle.createBattle",
      config: {
        policies: ["global::is-user"],
      },
    },
  ],
};
