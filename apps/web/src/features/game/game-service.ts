import { strapiApi } from "@/lib/strapi";
import {
  ModifyEntity,
  OmitEntityAttributes,
  StrapiEntity,
  StrapiImageResponse,
  StrapiRelation,
} from "@/types/strapi-types";
import { StrapiError } from "@/utils/strapi-error";
import { TeamEntity } from "../team/team-service";

// TODO: If I can't use the GameResponse type for the other API requests then set the strapi.find type not to
// automatically type the data as an array

// TODO: May start transorming the response to something more useful here

// TODO: Stop using a class and use separate files e.g. games/getGames.ts as it will make types less annoying

export type GameEntity = StrapiEntity<{
  title: string;
  card_image: StrapiImageResponse;
  cover_image: StrapiImageResponse;
  slug: string;
  teams: StrapiRelation<TeamEntity[]>;
}>;

export type GameResponse = ModifyEntity<GameEntity, "teams", {}>;

export type GetGamesSort = "date" | "title";

const populate = ["card_image", "cover_image"];

export class GameService {
  static async getGames(
    page: number,
    options: Partial<{
      sort: GetGamesSort;
      pageSize: number;
    }> = {}
  ) {
    const gamesResponse = await strapiApi.find<GameResponse>("games", {
      sort: options.sort === "date" ? "createdAt:asc" : "title:asc",
      populate,
      pagination: {
        page,
        pageSize: options.pageSize ?? 25,
      },
    });

    return gamesResponse;
  }

  static async recursivelyGetGames(
    page: number = 1,
    prevGames: GameResponse[] = []
  ): Promise<GameResponse[]> {
    const response = await GameService.getGames(page, {
      sort: "title",
      pageSize: 100,
    });

    const games = [...prevGames, ...response.data];

    if (page < response.meta.pagination.pageCount) {
      return GameService.recursivelyGetGames(page + 1, games);
    } else {
      return games;
    }
  }

  static async getGameBySlug(slug: string) {
    const gameResponse = await strapiApi.find<GameResponse>("games", {
      filters: {
        slug,
      },
      populate,
    });

    const game = gameResponse.data[0];
    if (!game) {
      throw new StrapiError(404, {
        name: "NotFound",
      });
    }

    return game;
  }
}
