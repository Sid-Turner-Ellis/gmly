import { strapiApi } from "@/lib/strapi";
import {
  StrapiComponent,
  StrapiEntity,
  StrapiImage,
  StrapiRelation,
} from "@/types/strapi-types";
import { StrapiError } from "@/utils/strapi-error";
import {
  TeamProfileWithoutRelations,
  TeamWithoutRelations,
} from "../team/team-service";
import { GameWithoutRelations } from "../game/game-service";
import { GamerTagWithoutRelations } from "../gamer-tag/gamer-tag-service";

// TODO: Consider updating the strapi service so that we don't deal with profileIDs but rather addresses

export type Regions = "Europe" | "North America" | "Asia" | "Oceania";

export type ProfileWithoutRelations = {
  wallet_address: string;
  region: Regions | null;
  username: string | null;
  wager_mode: boolean;
  trust_mode: boolean;
  balance: number;
  bio: string | null;
};

export type SocialLinksComponent = {
  discord: string | null;
  twitter: string | null;
};

export type Profile = ProfileWithoutRelations & {
  avatar: StrapiRelation<StrapiEntity<StrapiImage>> | null;
  social_links: SocialLinksComponent | null;
  gamer_tags: StrapiRelation<
    StrapiEntity<
      GamerTagWithoutRelations & {
        game: StrapiRelation<
          StrapiEntity<
            GameWithoutRelations & {
              card_image: StrapiRelation<StrapiEntity<StrapiImage>>;
            }
          >
        >;
      }
    >[]
  >;
  team_profiles: StrapiRelation<
    StrapiEntity<
      TeamProfileWithoutRelations & {
        invited_by: StrapiRelation<StrapiEntity<ProfileWithoutRelations>>;
        team: StrapiRelation<
          StrapiEntity<
            TeamWithoutRelations & {
              image: StrapiRelation<StrapiEntity<StrapiImage>>;
              game: StrapiRelation<StrapiEntity<GameWithoutRelations>>;
            }
          >
        >;
      }
    >[]
  >;
};

export type ProfileResponse = StrapiEntity<Profile>;

const populate = [
  "avatar",
  "team_profiles.team.image",
  "team_profiles.team.game",
  "team_profiles.invited_by",
  "gamer_tags",
  "gamer_tags.game",
  "gamer_tags.game.card_image",
  "social_links",
];

export class ProfileService {
  static async getProfileById(profileId: number) {
    const profileResponse = await strapiApi.findOne<ProfileResponse>(
      "profiles",
      profileId,
      {
        populate,
      }
    );

    return profileResponse;
  }
  static async getProfile(address: string) {
    const profileResponse = await strapiApi.find<ProfileResponse>("profiles", {
      filters: {
        wallet_address: address,
      },
      populate,
    });

    if (profileResponse.meta.pagination.total === 0) {
      throw new StrapiError(404, {
        name: "ProfileNotFound",
        message: `Profile not found for address ${address}`,
      });
    }

    return profileResponse.data[0];
  }

  static async createProfile(address: string): Promise<ProfileResponse> {
    const profileResponse = await strapiApi.create<ProfileResponse>(
      "profiles",
      {
        wallet_address: address,
      }
    );

    return profileResponse.data;
  }

  static async updateProfile({
    profileId,
    ...updateProps
  }: {
    profileId: number;
    username?: string;
    region?: Regions;
    wager_mode?: boolean;
    avatar?: number;
    bio?: string;
    trust_mode?: boolean;
  }) {
    const profileResponse = await strapiApi.update<ProfileResponse>(
      "profiles",
      profileId,
      updateProps,
      {
        populate,
      }
    );

    return profileResponse.data;
  }

  static async addSocialLink(
    profileId: number,
    platform: keyof SocialLinksComponent,
    value: string
  ) {
    const profileResponse = await strapiApi.update<ProfileResponse>(
      "profiles",
      profileId,
      {
        social_links: {
          [platform]: value,
        },
      },
      {
        populate,
      }
    );

    return profileResponse.data;
  }
  static async removeSocialLink(
    profileId: number,
    platform: keyof SocialLinksComponent
  ) {
    const profileResponse = await strapiApi.update<ProfileResponse>(
      "profiles",
      profileId,
      {
        social_links: {
          [platform]: null,
        },
      },
      {
        populate,
      }
    );

    return profileResponse.data;
  }
}
