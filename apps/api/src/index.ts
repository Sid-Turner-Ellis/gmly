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
  bootstrap({ strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ["api::team.team"],
      async beforeDelete(event) {
        const teamToDelete = await strapi.db
          .query("api::team.team")
          .findOne({ ...event.params, populate: { team_profiles: true } });

        event.state.teamProfileIds = teamToDelete.team_profiles.map(
          (tp) => tp.id
        );
      },

      async afterDelete(event) {
        // TODO: Send a notification here or on the team-profile hook
        await strapi.db.query("api::team-profile.team-profile").deleteMany({
          where: {
            id: {
              $in: event.state.teamProfileIds,
            },
          },
        });
      },
    });
  },
};
