import { StrapiResponse, strapiApi } from "@/lib/strapi";
import {
  StrapiEntity,
  StrapiImage,
  StrapiRelation,
} from "@/types/strapi-types";
import { StrapiError } from "@/utils/strapi-error";
import { Game, GameWithoutRelations } from "../game/game-service";
import { Profile, ProfileWithoutRelations } from "../profile/profile-service";

const transformTeamResponse = (tr: TeamResponse) => {
  tr.attributes.team_profiles.data?.forEach((tp) => {
    tp.attributes.xp = Math.floor(Math.random() * 1000);
    tp.attributes.rank = Math.floor(Math.random() * 1000);
    tp.attributes.earnings = Math.floor(Math.random() * 10000);
  });
  tr.attributes.wins = Math.floor(Math.random() * 1000);
  tr.attributes.losses = Math.floor(Math.random() * 1000);
};

export type TeamRoles = "founder" | "leader" | "member";

export type TeamProfileWithoutRelations = {
  is_pending: boolean;
  role: TeamRoles;
  xp: number;
  earnings: number;
  rank: number;
};

export type TeamProfile = TeamProfileWithoutRelations & {
  profile: StrapiRelation<
    StrapiEntity<ProfileWithoutRelations & Pick<Profile, "avatar">>
  >;
  invited_by: StrapiRelation<StrapiEntity<ProfileWithoutRelations>>;
};

export type TeamWithoutRelations = {
  name: string;
  wins: number;
  losses: number;
};

export type Team = TeamWithoutRelations & {
  image: StrapiRelation<StrapiEntity<StrapiImage>>;
  game: StrapiRelation<
    StrapiEntity<
      GameWithoutRelations & Pick<Game, "card_image" | "cover_image">
    >
  >;
  team_profiles: StrapiRelation<StrapiEntity<TeamProfile>[]>;
};

export type TeamResponse = StrapiEntity<Team>;

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
    {
      page,
      pageSize,
    }: Partial<{
      page: number;
      pageSize: number;
    }> = {}
  ) {
    const teams = await strapiApi.find<TeamResponse>("teams", {
      populate,
      pagination: {
        page: page ?? 1,
        pageSize: pageSize ?? 100,
      },
      filters: {
        team_profiles: {
          profile: profileId,
          is_pending: false,
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
      {
        populate,
      }
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

  static async respondToInvite(teamProfileId: number, accept: boolean) {
    if (accept) {
      await strapiApi.update("team-profiles", teamProfileId, {
        is_pending: false,
      });
    } else {
      await strapiApi.delete("team-profiles", teamProfileId);
    }
  }
}
