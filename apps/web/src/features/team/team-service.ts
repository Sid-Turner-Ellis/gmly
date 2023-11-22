import { strapiApi } from "@/lib/strapi";
import { StrapiEntity, StrapiImageResponse } from "@/types/strapi-types";
import { StrapiError } from "@/utils/strapi-error";
import { ProfileResponse } from "../profile/profile-service";

type TeamRoles = "founder" | "leader" | "member";

export type TeamProfile = StrapiEntity<{
  is_pending: boolean;
  role: TeamRoles;
  profile: {
    data: ProfileResponse;
  };
}>;

export type TeamResponse = StrapiEntity<{
  name: string;
  team_profiles: {
    data: TeamProfile[];
  };
}>;

export class TeamService {
  static async createTeam({
    name,
    gameId,
    image,
  }: {
    name: string;
    gameId: number;
    image?: number;
  }) {
    // Create the team
    const team = await strapiApi.create<TeamResponse>(
      "teams",
      {
        name,
        game: gameId,
        image,
      },
      { populate: ["team_profiles.profile.avatar"] }
    );
  }
  static async getTeam(teamId: number) {}
  static async getTeams() {}
  static async updateTeam() {}
  static async deleteTeam() {}
  static async inviteTeamMember() {}
  static async removeTeamMember() {}
  static async updateRole() {}
}
