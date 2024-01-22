import { errors } from "@strapi/utils";
const { ApplicationError } = errors;
import merge from "deepmerge";

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
  async afterCreate({ params: { data }, result }) {
    // const ctx = strapi.requestContext.get();
    // const profile = await strapi
    //   .service("api::profile.profile")
    //   .findOneByWalletAddress(ctx.state.wallet_address);

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
