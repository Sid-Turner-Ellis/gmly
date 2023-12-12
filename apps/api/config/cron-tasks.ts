export const cronTasks = {
  inviteExpiryJob: {
    async task({ strapi }) {
      // get the ISO string for the 24 hours ago, if the createdAt is less than this (lower than this), then it's expired
      const now = new Date();
      const expiredThreshold = new Date(now.getTime() - 23.5 * 60 * 60 * 1000); // 23 hours, 30 minutes ago

      const { results: expiredInvites } = await strapi.services[
        "api::team-profile.team-profile"
      ].find({
        filters: {
          $and: [
            {
              is_pending: true,
            },

            {
              createdAt: {
                $lt: expiredThreshold.toISOString(),
              },
            },
          ],
        },
      });

      await Promise.all(
        expiredInvites.map(async ({ id }) => {
          await strapi.service("api::team-profile.team-profile").delete(id);
        })
      );
    },
    options: {
      rule: "0 * * * *", // start of every hour
    },
  },
};
