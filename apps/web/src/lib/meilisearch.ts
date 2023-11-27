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
  apiKey: "15407997ba127f211ab734385fc1d8274eb3abb4cdb98eb56d0f72511728710e",
});

export const globalMelilisearchIndex =
  meilisearchClient.index<GlobalIndexHit>("global");
