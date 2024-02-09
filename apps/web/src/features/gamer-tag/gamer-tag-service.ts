import { strapiApi } from "@/lib/strapi";
import {
  StrapiEntity,
  StrapiImage,
  StrapiRelation,
} from "@/types/strapi-types";
import { StrapiError } from "@/utils/strapi-error";

// TODO: Consider moving this to the profile feature (2 services)
export type GamerTagWithoutRelations = {
  tag: string;
};

export type GamerTag = GamerTagWithoutRelations & {
  game: StrapiRelation<StrapiEntity<StrapiImage>>;
  profile: null;
};

export type GamerTagResponse = StrapiEntity<GamerTag>;

const populate = ["team_profiles.invited_by"];

export class GamerTagService {
  static async createGamerTag(gameId: number, tag: string) {
    const gamerTagResponse = await strapiApi.create<GamerTagResponse>(
      "gamer-tags",
      {
        tag,
        game: gameId,
      }
    );
    return gamerTagResponse;
  }
  //   static async getProfileById(profileId: number) {
  //     const profileResponse = await strapiApi.findOne<ProfileResponse>(
  //       "profiles",
  //       profileId,
  //       {
  //         populate,
  //       }
  //     );
  //     return profileResponse;
  //   }
}
