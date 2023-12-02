import { StrapiResponse, strapiApi } from "@/lib/strapi";
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

export type TeamRoles = "founder" | "leader" | "member";

export type TeamProfileEntity = StrapiEntity<{
  is_pending: boolean;
  role: TeamRoles;
  xp: number;
  earnings: number;
  rank: number;
  profile: StrapiRelation<ProfileEntity>;
  team: StrapiRelation<TeamEntity>;
}>;

const transformTeamResponse = (tr: TeamResponse) => {
  tr.attributes.team_profiles.data?.forEach((tp) => {
    tp.attributes.xp = Math.floor(Math.random() * 1000);
    tp.attributes.rank = Math.floor(Math.random() * 1000);
    tp.attributes.earnings = Math.floor(Math.random() * 10000);
  });

  tr.attributes.wins = Math.floor(Math.random() * 1000);
  tr.attributes.losses = Math.floor(Math.random() * 1000);
};

export type TeamEntity = StrapiEntity<{
  image: StrapiImageResponse;
  name: string;
  game: StrapiRelation<GameEntity>;
  team_profiles: StrapiRelation<TeamProfileEntity[]>;
  wins: number;
  losses: number;
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
  "image",
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

    transformTeamResponse(newTeam.data);
    return newTeam;
  }

  static async getTeam(teamId: number) {
    const team = await strapiApi.findOne<TeamResponse>("teams", teamId, {
      populate,
    });

    transformTeamResponse(team.data);
    return team;
  }

  static async getTeamsForProfile(
    profileId: number,
    page: number,
    pageSize: number
  ) {
    const teams = await strapiApi.find<TeamResponse>("teams", {
      populate,
      pagination: {
        page,
        pageSize,
      },
      filters: {
        team_profiles: {
          profile: profileId,
        },
      },
    });

    teams.data.forEach((t) => {
      transformTeamResponse(t);
    });
    return teams;
  }

  static async getTeams() {
    const teams = await strapiApi.find<TeamResponse>("teams", {
      populate,
    });

    teams.data.forEach((t) => {
      transformTeamResponse(t);
    });
    return teams;
  }
  static async updateTeam(
    teamId: number,
    data: Partial<{
      name: string;
      image?: number;
    }>
  ) {
    const updatedTeam = await strapiApi.update<TeamResponse>(
      "teams",
      teamId,
      data,
      { populate }
    );

    transformTeamResponse(updatedTeam.data);
    return updatedTeam;
  }

  static async deleteTeam(id: number) {
    await strapiApi.delete<TeamResponse>("teams", id);
  }

  static async bulkUpdateTeamMembers(
    teamId: number,
    updatedTeam: { profile: number; role: TeamRoles }[]
  ) {
    const teamUpdateResponse = await strapiApi.request<
      StrapiResponse<TeamResponse>
    >("post", `/teams/${teamId}/bulk-update-members`, {
      data: {
        data: updatedTeam,
      },
      params: {
        populate,
      },
    });
    transformTeamResponse(teamUpdateResponse.data);
    return teamUpdateResponse;
  }
  static async leaveTeam(teamId: number) {
    await strapiApi.request<StrapiResponse<TeamResponse>>(
      "get",
      `/teams/${teamId}/leave`,
      {
        params: {
          populate,
        },
      }
    );
  }
  static async updateRole() {}
}
