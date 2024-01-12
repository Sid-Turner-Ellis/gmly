import merge from "deepmerge";

export default {
  async beforeDeleteMany(event) {
    const teamsToBeDeleted = await strapi.db
      .query("api::team.team")
      .findMany(merge(event.params, { populate: { team_profiles: true } }));

    const teamProfilesToDelete = teamsToBeDeleted
      .map((t) => t.team_profiles)
      .flat();

    await strapi.db.query("api::team-profile.team-profile").deleteMany({
      where: { id: { $in: teamProfilesToDelete.map((tp) => tp.id) } },
    });
  },
  async beforeDelete(event) {
    // TODO: Investigate why are we fetching the team rather than going directly to the team profiles
    // TODO: are these team profiles going to be paginated?
    const mergedParames = merge(event.params, {
      populate: { team_profiles: true },
    });
    const teamToBeDeleted = await strapi.db
      .query("api::team.team")
      .findOne(mergedParames);

    // Note the deleting of team profiles will trigger the delete team profile hook which will delete the notifications
    await Promise.all(
      teamToBeDeleted.team_profiles.map((tp) =>
        strapi.db.query("api::team-profile.team-profile").delete({
          where: { id: tp.id },
        }),
      ),
    );
  },
};
