const { sharedConfig } = require("./team");

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/teams/:id/bulk-update-members",
      handler: "team.bulkUpdateMembers",
      config: {
        policies: ["global::is-user"],
      },
    },
    {
      method: "GET",
      path: "/teams/:id/leave",
      handler: "team.leave",
      config: {
        policies: ["global::is-user"],
      },
    },
  ],
};
