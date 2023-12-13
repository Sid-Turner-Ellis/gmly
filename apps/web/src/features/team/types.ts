import { StrapiImage } from "@/types/strapi-types";
import { TeamRoles } from "./team-service";

export type TeamMemberUpdate = {
  image: StrapiImage | null;
  username: string;
  userId: number;
  role: TeamRoles;
  isPending: boolean;
};
