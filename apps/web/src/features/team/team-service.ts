import { strapiApi } from "@/lib/strapi";
import {
  ModifyEntity,
  ModifyRelationAttributes,
  OmitEntityAttributes,
  PickEntityAttributes,
  StrapiEntity,
  StrapiImageResponse,
  StrapiRelation,
} from "@/types/strapi-types";
import { StrapiError } from "@/utils/strapi-error";
import { ProfileEntity, ProfileResponse } from "../profile/profile-service";
import { GameEntity } from "../game/game-service";

type TeamRoles = "founder" | "leader" | "member";

export type TeamProfileEntity = StrapiEntity<{
  is_pending: boolean;
  role: TeamRoles;
  profile: StrapiRelation<ProfileEntity>;
  team: StrapiRelation<TeamEntity>;
}>;

export type TeamEntity = StrapiEntity<{
  image: StrapiImageResponse;
  name: string;
  game: StrapiRelation<GameEntity>;
  team_profiles: StrapiRelation<TeamProfileEntity[]>;
}>;

type TeamResponseParts = {
  game: ModifyRelationAttributes<
    TeamEntity["attributes"]["game"],
    { teams: never }
  >;
  profile: ModifyRelationAttributes<
    NonNullable<
      TeamEntity["attributes"]["team_profiles"]["data"]
    >[number]["attributes"]["profile"],
    {
      team_profiles: never;
    }
  >;
  team_profiles: ModifyRelationAttributes<
    TeamEntity["attributes"]["team_profiles"],
    {
      team: never;
      profile: TeamResponseParts["profile"];
    }
  >;
};

export type TeamResponse = ModifyEntity<
  TeamEntity,
  "team_profiles",
  {
    team_profiles: TeamResponseParts["team_profiles"];
  }
>;

const populate = [
  "team_profiles.profile.avatar",
  "game.cover_image",
  "game.card_image",
];

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
    const newTeam = await strapiApi.create<TeamResponse>(
      "teams",
      {
        name,
        game: gameId,
        image,
      },
      { populate: ["team_profiles.profile.avatar"] }
    );

    return newTeam;
  }
  static async getTeam(teamId: number) {}
  static async getTeams() {
    const teams = await strapiApi.find<TeamResponse>("teams", {
      populate,
    });

    return teams;
  }
  static async updateTeam() {}
  static async deleteTeam() {}
  static async inviteTeamMember() {}
  static async removeTeamMember() {}
  static async updateRole() {}
}
