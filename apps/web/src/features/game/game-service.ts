import { strapiApi } from "@/lib/strapi";
import { StrapiEntity, StrapiImageResponse } from "@/types/strapi-types";
import { StrapiError } from "@/utils/strapi-error";

// TODO: If I can't use the GameResponse type for the other API requests then set the strapi.find type not to
// automatically type the data as an array

// TODO: May start transorming the response to something more useful here

// TODO: Stop using a class and use separate files e.g. games/getGames.ts as it will make types less annoying

export type GameResponse = StrapiEntity<{
  title: string;
  card_image: StrapiImageResponse;
  cover_image: StrapiImageResponse;
  slug: string;
}>;

export type GetGamesSort = "date" | "title";

export class GameService {
  static async getGames(page: number, sort?: GetGamesSort) {
    const gamesResponse = await strapiApi.find<GameResponse>("games", {
      sort: sort === "date" ? "createdAt:asc" : "title:asc",
      populate: "*",
      pagination: {
        page,
        pageSize: 25,
      },
    });

    return gamesResponse;
  }

  static async getGameBySlug(slug: string) {
    const gameResponse = await strapiApi.find<GameResponse>("games", {
      filters: {
        slug,
      },
      populate: "*",
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
