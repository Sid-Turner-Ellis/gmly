import { strapiApi } from "@/lib/strapi";
import { getSeriesNumberFromSeriesOption } from "./util";

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
}
