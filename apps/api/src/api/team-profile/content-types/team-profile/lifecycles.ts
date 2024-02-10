import { errors } from "@strapi/utils";
const { ApplicationError } = errors;

export default {
  async afterCreateMany({ params: { data }, result }) {
    // Bulk operations don't support relations and the result doesn't contain the created relations
    throw new ApplicationError(
      "afterCreateMany has been disabled for team-profile",
    );
    const teamProfilesToCreateNotificationsFor = await strapi.db
      .query("api::team-profile.team-profile")
      .findMany({
        where: {
          $and: [
            {
              id: { $in: result.ids },
            },
            {
              is_pending: true,
            },
          ],
        },
        populate: {
          team: true,
          profile: true,
        },
      });
  },

  // TODO: Consider the markAsRead notification logic here instead  - when the team profile goes from pending to not pending we can delete the notification
  async afterCreate({ params: { data }, result }) {
    // Send out a notification to the user
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

  async beforeUpdate({ params: { where, data } }) {
    const teamProfileToBeUpdated = await strapi.db
      .query("api::team-profile.team-profile")
      .findOne({
        where,
        populate: { team: { populate: { game: true } }, profile: true },
      });
    const gameId = teamProfileToBeUpdated.team.game.id;
    const profileId = teamProfileToBeUpdated.profile.id;
    const gamerTagForTeamsGame = await strapi.db
      .query("api::gamer-tag.gamer-tag")
      .findOne({
        where: {
          game: gameId,
          profile: profileId,
        },
      });
    data.gamer_tag = gamerTagForTeamsGame?.id;
  },
  async beforeCreate({ params }) {
    const setGamerTagForTeamsGame = async () => {
      const teamId = params.data.team;
      const profileId = params.data.profile;

      const gameForTeam = await strapi.db.query("api::team.team").findOne({
        where: {
          id: teamId,
        },
        populate: {
          game: true,
        },
      });

      const gameId = gameForTeam.game.id;

      const gamerTagForTeamsGame = await strapi.db
        .query("api::gamer-tag.gamer-tag")
        .findOne({
          where: {
            game: gameId,
            profile: profileId,
          },
        });

      params.data.gamer_tag = gamerTagForTeamsGame?.id;
    };

    await setGamerTagForTeamsGame();
  },

  async beforeDeleteMany(ev) {
    // Ideally we would delete notifications here too but unfortunately strapi doesn't give us access to the relations here
    // const teamProfilesToBeDeleted = await strapi.db
    //   .query("api::team-profile.team-profile")
    //   .findMany(merge(ev.params, { populate: { team: true, profile: true } }));
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
};
