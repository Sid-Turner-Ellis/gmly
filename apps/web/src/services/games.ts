import { strapiApi } from "@/lib/strapi";
import { StrapiImageResponse } from "@/types";
import { StrapiError } from "@/utils/strapi-error";
import QueryString from "qs";

// TODO: If I can't use the GameResponse type for the other API requests then set the strapi.find type not to
// automatically type the data as an array

// TODO: May start transorming the response to something more useful here

// TODO: Stop using a class and use separate files e.g. games/getGames.ts as it will make types less annoying

export type GameResponse = {
  id: number;
  attributes: {
    title: string;
    card_image: StrapiImageResponse;
    cover_image: StrapiImageResponse;
    slug: string;
  };
};

export class GamesService {
  static async getGames(page = 1) {
    const gamesResponse = await strapiApi.find<GameResponse>("games", {
      sort: "title:asc",
      populate: "*",
      pagination: {
        page,
        pageSize: 4,
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
