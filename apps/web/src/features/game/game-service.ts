import { strapiApi } from "@/lib/strapi";
import {
  StrapiEntity,
  StrapiImage,
  StrapiRelation,
} from "@/types/strapi-types";
import { StrapiError } from "@/utils/strapi-error";

// TODO: If I can't use the GameResponse type for the other API requests then set the strapi.find type not to
// automatically type the data as an array

// TODO: May start transorming the response to something more useful here

// TODO: Stop using a class and use separate files e.g. games/getGames.ts as it will make types less annoying

export type GameWithoutRelations = {
  title: string;
  slug: string;
  max_team_size: number;
};

// TODO: as we add more types we can extract out most of this
export type SelectCustomAttribute = {
  id: number;
  input_type: "dropdown" | "radio" | "multi-select";
  __component: "custom-attributes.select";
  attribute: {
    attribute_id: string;
    display_name: string;
  };
  options: { option_id: string; display_name: string }[];
};

export type Game = GameWithoutRelations & {
  card_image: StrapiRelation<StrapiEntity<StrapiImage>>;
  cover_image: StrapiRelation<StrapiEntity<StrapiImage>>;
  custom_attributes: SelectCustomAttribute[];
};

export type GameResponse = StrapiEntity<Game>;

export type GetGamesSort = "date" | "title";

const populate = [
  "card_image",
  "cover_image",
  "custom_attributes",
  "custom_attributes.options",
  "custom_attributes.attribute",
];

export class GameService {
  static async getGame(id: number) {
    const gameResponse = await strapiApi.findOne<GameResponse>("games", id, {
      populate,
    });
    return gameResponse.data;
  }
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
