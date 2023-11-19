import { StrapiImage } from "@/types/strapi-types";

export type GlobalIndexHit = {
  name: string;
  collection_type: "profiles" | "games";
  image: StrapiImage;
  id: number;
  slug: string | number;
};
