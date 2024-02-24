import { strapiApi } from "@/lib/strapi";
import { getSeriesNumberFromSeriesOption } from "./util";
import { StrapiEntity, StrapiRelation } from "@/types/strapi-types";

export type MatchRegions = "Europe" | "North America" | "Asia" | "Oceania";

export type CreateBattleParams = {
  time: string;
  region: MatchRegions;
  series: "Bo1" | "Bo3" | "Bo5";
  wagerAmount: number;
  customAttributes?: Record<string, string | string[]>;
  teamSelection: number[];
  invitedTeamId?: number;
  teamProfileId: number;
};

type BattleWithoutRelations = {
  date: string;
  wager_amount: number;
};

type Battle = BattleWithoutRelations & {
  match_options: {
    custom_attribute_inputs: {
      attribute_id: string;
      value: string | string[];
    }[];
    team_size: number;
    series: number;
    region: MatchRegions;
  };
};

export type BattleResponse = StrapiEntity<Battle>;

type Match = StrapiEntity<{
  battle: StrapiRelation<BattleResponse, false>;
  createdAt: string;
  updatedAt: string;
  match_meta: Record<string, unknown>;
}>;

export class BattleService {
  static async createBattle(params: CreateBattleParams) {
    const id = params.teamProfileId;
    const data = {
      total_wager_amount: params.wagerAmount,
      team_selection: params.teamSelection,
      invited_team_id: params.invitedTeamId,
      date: params.time,
      match_options: {
        custom_attribute_inputs: Object.entries(
          params.customAttributes ?? {}
        ).map(([attributeId, value]) => ({ attribute_id: attributeId, value })),
        series: getSeriesNumberFromSeriesOption(params.series),
        region: params.region,
      },
    };

    return strapiApi.request("post", `/battles/create/${id}`, {
      data: { data },
    });
  }

  static async getJoinableBattles({
    gameId,
    teamId,
    pageNumber,
    pageSize,
  }: {
    gameId: number;
    teamId?: number;
    pageNumber: number;
    pageSize: number;
  }) {
    const matches = await strapiApi.find<Match>("matches", {
      pagination: {
        page: pageNumber,
        pageSize,
      },
      populate: {
        battle: {
          populate: {
            match_options: true,
          },
        },
      },
      sort: {
        battle: {
          date: "asc",
        },
      },
      filters: {
        home_team: {
          team: { id: { $ne: teamId } },
        },
        battle: {
          id: { $null: false },
          invited_team: { id: { $null: true } },
          date: { $gt: new Date().toISOString() },
          match_options: {
            game: gameId,
          },
        },
      },
    });

    const battles = matches.data.map((match) => match.attributes.battle.data);

    return { data: battles, meta: matches.meta } as const;
  }
}
