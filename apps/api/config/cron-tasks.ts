import { ethers } from "ethers";

export const cronTasks = {
  notificationExpiryJob: {
    async task() {
      const now = new Date();
      // get the ISO string for the 24 hours ago, if the createdAt is less than this (lower than this), then it's expired
      const expiredThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      await strapi.db.query("api::notification.notification").deleteMany({
        where: {
          createdAt: {
            $lt: expiredThreshold.toISOString(),
          },
        },
      });
    },
    options: {
      rule: "*/15 * * * * *",
    },
  },
  inviteExpiryJob: {
    async task({ strapi }) {
      const now = new Date();
      const expiredThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      // Note that we can't use deleteMany here because there is a delete hook for the team profile that deletes the notification
      const { results: expiredInvites } = await strapi.services[
        "api::team-profile.team-profile"
      ].find({
        pagination: {
          pageSize: 250,
        },
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
        }),
      );
    },
    options: {
      rule: "*/15 * * * * *",
    },
  },
};
