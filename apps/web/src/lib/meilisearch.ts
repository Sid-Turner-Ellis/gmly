import { StrapiImage } from "@/types/strapi-types";
import MeiliSearch from "meilisearch";

export type GlobalIndexHit = {
  name: string;
  collection_type: "profiles" | "games";
  image: StrapiImage;
  id: number;
  slug: string | number;
};

const meilisearchClient = new MeiliSearch({
  host: "http://127.0.0.1:7700",
  apiKey: "7d9083e1f96ce169ffffcff007bd5ec46e150df26fae99d358ce4f97e759b115",
  // apiKey: "3c6a9acf38532daa40802ab684137a889a97c4ef88ffc76bdd710ffdb9658688",
});

export const globalMelilisearchIndex =
  meilisearchClient.index<GlobalIndexHit>("global");
