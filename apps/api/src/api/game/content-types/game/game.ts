// Interface automatically generated by schemas-to-ts

import { Media } from "../../../../common/schemas-to-ts/Media";
import { Team } from "../../../team/content-types/team/team";
import { Team_Plain } from "../../../team/content-types/team/team";
import { AdminPanelRelationPropertyModification } from "../../../../common/schemas-to-ts/AdminPanelRelationPropertyModification";

export interface Game {
  id: number;
  attributes: {
    createdAt: Date;
    updatedAt: Date;
    publishedAt?: Date;
    title: string;
    card_image: { data: Media };
    cover_image: { data: Media };
    slug: string;
    teams: { data: Team[] };
  };
}
export interface Game_Plain {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  title: string;
  card_image: Media;
  cover_image: Media;
  slug: string;
  teams: Team_Plain[];
}

export interface Game_NoRelations {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  title: string;
  card_image: number;
  cover_image: number;
  slug: string;
  game_modes: number[];
  teams: number[];
}

export interface Game_AdminPanelLifeCycle {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  title: string;
  card_image: AdminPanelRelationPropertyModification<Media>;
  cover_image: AdminPanelRelationPropertyModification<Media>;
  slug: string;
  teams: AdminPanelRelationPropertyModification<Team_Plain>;
}
