export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */

  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // WARNING: DO NOT USE MANY HOOKS UNTIL THE BELOW TODO IS HANDLED
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // TODO: Create and Delete also have 'many' versions that we should probably hook into

  bootstrap({ strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ["api::team-profile.team-profile"],

      async afterCreate({ params: { data }, result }) {
        const ctx = strapi.requestContext.get();
        const profile = await strapi
          .service("api::profile.profile")
          .findOneByWalletAddress(ctx.state.wallet_address);

        // Only send a notification if the team profile is pending (not founders on team creation)
        if (result.is_pending) {
          await strapi.service("api::notification.notification").create({
            data: {
              type: "TEAM_INVITE_RECEIVED",
              team: data.team,
              profile: data.profile,
            },
          });
        }
      },

      async beforeDelete({
        params: {
          where: { id },
        },
      }) {
        const teamProfileToBeDeleted = await strapi
          .service("api::team-profile.team-profile")
          .findOne(id, { populate: { team: true, profile: true } });

        await strapi.db.query("api::notification.notification").delete({
          where: {
            type: "TEAM_INVITE_RECEIVED",
            team: teamProfileToBeDeleted.team.id,
            profile: teamProfileToBeDeleted.profile.id,
          },
        });
      },
    });
    strapi.db.lifecycles.subscribe({
      models: ["api::team.team"],
      async beforeDelete(event) {
        const teamToBeDeleted = await strapi.db
          .query("api::team.team")
          .findOne({ ...event.params, populate: { team_profiles: true } });

        // Note the deleting of team profiles will trigger the delete profile hook which will delete the notifications
        await Promise.all(
          teamToBeDeleted.team_profiles.map((tp) =>
            strapi.db.query("api::team-profile.team-profile").delete({
              where: { id: tp.id },
            })
          )
        );
      },
    });
  },
};
