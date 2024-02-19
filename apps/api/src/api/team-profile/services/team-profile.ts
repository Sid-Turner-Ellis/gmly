/**
 * team-profile service
 */

import { factories } from "@strapi/strapi";
import merge from "deepmerge";

export default factories.createCoreService("api::team-profile.team-profile", {
  async findOne(entityId, params) {
    const teamProfile = await super.findOne(entityId, params);
    const profile = teamProfile?.profile;

    if (profile?.id) {
      profile.balance = await strapi
        .service("api::profile.profile")
        .getBalanceForProfile(profile.id);
    }

    return teamProfile;
  },

  async find(params) {
    const teamProfiles = await super.find(params);
    const profileIds =
      teamProfiles.results
        ?.map((teamProfile) => teamProfile.profile?.id)
        .filter(Boolean) ?? [];

    if (profileIds.length) {
      const profileBalances = await strapi
        .service("api::profile.profile")
        .getBalanceForProfiles(profileIds);

      teamProfiles.results.forEach((teamProfile) => {
        if (teamProfile.profile) {
          teamProfile.profile.balance =
            profileBalances.find(
              (profile) => profile.id === teamProfile.profile.id,
            )?.balance ?? 0;
        }
      });
    }

    return teamProfiles;
  },

  async findTeamProfilesByTeamId(teamId, params: any = {}) {
    const mergedParams = merge(params, {
      filters: {
        team: teamId,
      },
    });

    const teamProfiles = await this.find(mergedParams);

    return teamProfiles;
  },

  async findTeamProfileByProfileId(teamId, profileId, params: any = {}) {
    const mergedParams = merge(params, {
      filters: {
        team: teamId,
        profile: profileId,
      },
    });

    const teamProfiles = await this.find(mergedParams);

    return teamProfiles.results[0] ?? null;
  },

  async findFounderTeamProfile(teamId, params: any = {}) {
    const mergedParams = merge(params, {
      filters: {
        role: "founder",
      },
      populate: {
        profile: true,
      },
    });

    const profiles = await this.findTeamProfilesByTeamId(teamId, mergedParams);

    // TODO: why the is it profiles[0] for profiles but .results for others
    const founder = profiles.results[0];
    return founder;
  },
});
