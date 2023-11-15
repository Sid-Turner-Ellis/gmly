import { StrapiImage } from "@/types";

export type GlobalIndexHit = {
  name: string;
  collection_type: "profiles" | "games";
  image: StrapiImage;
  id: number;
};
