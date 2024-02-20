/**
 * team service
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreService("api::team.team", {
  async findOne(entityId, params) {
    const team = await super.findOne(entityId, params);
    const profileIds =
      team?.team_profiles
        ?.map((teamProfile) => teamProfile.profile?.id)
        .filter(Boolean) ?? [];

    if (profileIds.length > 0) {
      const profileBalances = await strapi
        .service("api::profile.profile")
        .getBalanceForProfiles(profileIds);

      team?.team_profiles?.forEach((teamProfile) => {
        if (teamProfile.profile) {
          teamProfile.profile.balance = profileBalances.find(
            (profile) => profile.id === teamProfile.profile.id,
          )?.balance;
        }
      });
    }

    return team;
  },

  async find(params) {
    const teams = await super.find(params);
    const profileIds =
      teams.results
        ?.map(
          (team) =>
            team?.team_profiles?.map((teamProfile) => teamProfile.profile?.id),
        )
        .flat()
        .filter(Boolean) ?? [];

    if (profileIds.length > 0) {
      const profileBalances = await strapi
        .service("api::profile.profile")
        .getBalanceForProfiles(profileIds);

      teams.results.forEach((team) => {
        team.team_profiles?.forEach((teamProfile) => {
          if (teamProfile.profile) {
            teamProfile.profile.balance =
              profileBalances.find(
                (profile) => profile.id === teamProfile.profile.id,
              )?.balance ?? 0;
          }
        });
      });
    }

    return teams;
  },
});
