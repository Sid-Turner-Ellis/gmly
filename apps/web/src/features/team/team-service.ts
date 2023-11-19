import { strapiApi } from "@/lib/strapi";
import { StrapiEntity, StrapiImageResponse } from "@/types/strapi-types";
import { StrapiError } from "@/utils/strapi-error";

export type TeamResponse = StrapiEntity<{}>;

export class TeamService {
  static async getProfileById(profileId: number) {}
}
