/**
 * team-profile service
 */

import { factories } from "@strapi/strapi";
import merge from "deepmerge";

export default factories.createCoreService("api::team-profile.team-profile", {
  async findTeamProfilesByTeamId(teamId, params: any = {}) {
    const mergedParams = merge(params, {
      filters: {
        team: teamId,
      },
    });

    const teamProfiles = await this.find(mergedParams);

    return teamProfiles;
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
