import { strapiApi } from "@/lib/strapi";
import {
  ModifyEntity,
  ModifyRelationAttributes,
  OmitEntityAttributes,
  PickEntityAttributes,
  StrapiEntity,
  StrapiImageResponse,
  StrapiRelation,
} from "@/types/strapi-types";
import { StrapiError } from "@/utils/strapi-error";
import { TeamEntity, TeamProfileEntity } from "../team/team-service";
import { GameEntity } from "../game/game-service";

// TODO: Consider updating the strapi service so that we don't deal with profileIDs but rather addresses
export type Regions = "Europe" | "NA" | "Asia" | "Oceania";

export type ProfileEntity = StrapiEntity<{
  wallet_address: string;
  region: Regions | null;
  username: string | null;
  wager_mode: boolean;
  trust_mode: boolean;
  bio: string | null;
  avatar: StrapiImageResponse | null;
  team_profiles: StrapiRelation<TeamProfileEntity[]>;
}>;

type ProfileResponseParts = {
  team: ModifyRelationAttributes<
    NonNullable<
      ProfileEntity["attributes"]["team_profiles"]["data"]
    >[number]["attributes"]["team"],
    {
      profile: never;
      game: never;
      team_profiles: never;
    }
  >;
  team_profiles: ModifyRelationAttributes<
    ProfileEntity["attributes"]["team_profiles"],
    {
      profile: never;
      team: ProfileResponseParts["team"];
    }
  >;
};

export type ProfileResponse = ModifyEntity<
  ProfileEntity,
  "team_profiles",
  {
    team_profiles: ProfileResponseParts["team_profiles"];
  }
>;

const populate = ["avatar", "team_profiles.team.image"];

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
}
