import {
  ModifyEntity,
  ModifyRelationAttributes,
  PickEntityAttributes,
  StrapiEntity,
  StrapiRelation,
} from "@/types/strapi-types";
import { TeamEntity, TeamProfileEntity } from "../team/team-service";
import { strapiApi } from "@/lib/strapi";

enum NOTIFICATION_TYPES {
  TeamInvite = "TEAM_INVITE_RECEIVED",
}

type SharedNotificationAttributes = {
  read: boolean;
  type: NOTIFICATION_TYPES;
};

type TeamInviteReceivedNotification = StrapiEntity<
  SharedNotificationAttributes & {
    team: StrapiRelation<TeamEntity>;
    team_profile: StrapiRelation<TeamProfileEntity>;
  }
>;

export type TeamInviteReceivedNotificationResponse = ModifyEntity<
  NotificationEntity,
  "team" | "team_profile",
  {
    team: PickEntityAttributes<TeamEntity, "name">;
    // Only need the team profile id to validate it still exists
    team_profile: PickEntityAttributes<TeamProfileEntity, never>;
  }
>;

export const isTeamInviteReceivedNotification = (
  v: unknown
): v is TeamInviteReceivedNotificationResponse => {
  const value = v as TeamInviteReceivedNotificationResponse;
  const isCorrectType = value.attributes.type === NOTIFICATION_TYPES.TeamInvite;
  const hasLinkedTeam = typeof value.attributes?.team?.id === "number";
  const hasLinkedTeamProfile =
    typeof value.attributes?.team_profile?.id === "number";

  return isCorrectType && hasLinkedTeam && hasLinkedTeamProfile;
};

type NotificationEntity = TeamInviteReceivedNotification;

export type NotificationResponse = ModifyEntity<
  NotificationEntity,
  "team",
  { team: PickEntityAttributes<TeamEntity, "name"> }
>;

const populate = ["team", "team_profile"];

export class NotificationService {
  static async getUnreadNotificationsForProfile(profileId: number) {
    const notificationsResponse = await strapiApi.find("notifications", {
      populate,
      filters: { read: false, profile: profileId },
    });

    return notificationsResponse;
  }

  static async markAsRead(notificationId: number) {
    await strapiApi.update("notifications", notificationId, { read: true }, {});
  }

  static async markAllAsSeen(profileId: number) {
    await strapiApi.request("post", `/notifications/mark-all-as-seen`, {
      data: {
        data: {
          profile: profileId,
        },
      },
    });
  }
}
