import { StrapiEntity, StrapiRelation } from "@/types/strapi-types";
import { strapiApi } from "@/lib/strapi";
import { Team, TeamWithoutRelations } from "../team/team-service";

export enum NOTIFICATION_TYPES {
  TeamInviteReceived = "TEAM_INVITE_RECEIVED",
  TransactionResult = "TRANSACTION_RESULT",
}

type SharedNotificationAttributes = {
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

export type TransactionResultNotificationResponse = StrapiEntity<
  SharedNotificationAttributes & {
    transaction_result_details: {
      didFail: boolean;
      type: "deposit" | "withdraw";
      amount: number;
    };
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

export const isTransactionResultNotification = (
  v: unknown
): v is TransactionResultNotificationResponse => {
  const value = v as TransactionResultNotificationResponse;
  const isCorrectType =
    value.attributes.type === NOTIFICATION_TYPES.TransactionResult;

  const { amount, type, didFail } = value.attributes.transaction_result_details;

  return (
    isCorrectType &&
    typeof amount === "number" &&
    typeof type === "string" &&
    typeof didFail === "boolean"
  );
};

export type NotificationResponse =
  | TeamInviteReceivedNotificationResponse
  | TransactionResultNotificationResponse;

const populate = ["team", "team.image"];

export class NotificationService {
  static async getNotificationsForProfile(profileId: number) {
    const notificationsResponse = await strapiApi.find<NotificationResponse>(
      "notifications",
      {
        populate,
        filters: { profile: profileId },
        pagination: {
          pageSize: 6,
          page: 1,
        },
      }
    );

    return notificationsResponse;
  }

  static async markAsRead(notificationId: number) {
    const deletedNotification = await strapiApi.delete<NotificationResponse>(
      "notifications",
      notificationId,
      {}
    );
    return deletedNotification;
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
