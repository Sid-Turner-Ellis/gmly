const { sharedConfig } = require("./team");

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/teams/:id/invite",
      handler: "team.invite",
      config: {
        ...sharedConfig,
      },
    },
  ],
};
