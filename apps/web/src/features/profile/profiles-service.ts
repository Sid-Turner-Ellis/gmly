import { strapiApi } from "@/lib/strapi";
import { StrapiImageResponse } from "@/types";
import { StrapiError } from "@/utils/strapi-error";

// TODO: Consider updating the strapi service so that we don't deal with profileIDs but rather addresses
export type Regions = "Europe" | "NA" | "Asia" | "Oceania";

export type ProfileResponse = {
  id: number;
  attributes: {
    wallet_address: string;
    region: Regions | null;
    username: string | null;
    wager_mode: boolean;
    trust_mode: boolean;
    createdAt: string; // ISO 8601
    bio: string | null;
    avatar: StrapiImageResponse | null;
  };
};

const populate = ["avatar"];

export class ProfilesService {
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
