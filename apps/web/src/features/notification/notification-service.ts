import { StrapiEntity, StrapiRelation } from "@/types/strapi-types";
import { strapiApi } from "@/lib/strapi";
import { Team, TeamWithoutRelations } from "../team/team-service";

enum NOTIFICATION_TYPES {
  TeamInviteReceived = "TEAM_INVITE_RECEIVED",
}

type SharedNotificationAttributes = {
  read: boolean;
  seen: boolean;
  type: NOTIFICATION_TYPES;
};

export type TeamInviteReceivedNotificationResponse = StrapiEntity<
  SharedNotificationAttributes & {
    team: StrapiRelation<
      StrapiEntity<TeamWithoutRelations & Pick<Team, "image">>
    >;
  }
>;

export const isTeamInviteReceivedNotification = (
  v: unknown
): v is TeamInviteReceivedNotificationResponse => {
  const value = v as TeamInviteReceivedNotificationResponse;
  const isCorrectType =
    value.attributes.type === NOTIFICATION_TYPES.TeamInviteReceived;
  const hasLinkedTeam = typeof value.attributes?.team?.data?.id === "number";

  return isCorrectType && hasLinkedTeam;
};

export type NotificationResponse = TeamInviteReceivedNotificationResponse;

const populate = ["team", "team.image"];

export class NotificationService {
  static async getUnreadNotificationsForProfile(profileId: number) {
    const notificationsResponse = await strapiApi.find<NotificationResponse>(
      "notifications",
      {
        populate,
        filters: { read: false, profile: profileId },
        pagination: {
          pageSize: 6,
          page: 1,
        },
      }
    );

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
