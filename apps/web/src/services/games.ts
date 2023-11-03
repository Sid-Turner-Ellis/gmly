import { Strapi } from "@/lib/strapi";
import QueryString from "qs";

// TODO: If I can't use the GameResponse type for the other API requests then set the strapi.find type not to
// automatically type the data as an array

// TODO: May start transorming the response to something more useful here

type GameResponse = {
  id: number;
  attributes: {
    title: string;
    card_image: {
      data: {
        attributes: {
          url: string;
          width: number;
          height: number;
          formats: {};
        };
      };
    };
  };
};

export class GamesService {
  static async getGames(page = 1) {
    try {
      const strapiApi = new Strapi();

      const gamesResponse = await strapiApi.find<GameResponse>("games", {
        sort: "title:asc",
        populate: "*",
        pagination: {
          page,
          pageSize: 25,
        },
      });

      return gamesResponse;
    } catch (error) {
      console.log(error);
      throw new Error("Error fetching games");
    }
  }
}
