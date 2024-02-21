import { StrapiEntity, StrapiRelation } from "@/types/strapi-types";
import { strapiApi } from "@/lib/strapi";
import { Team, TeamWithoutRelations } from "../team/team-service";

export enum NOTIFICATION_TYPES {
  TeamInviteReceived = "TEAM_INVITE_RECEIVED",
  TransactionResult = "TRANSACTION_RESULT",
  EnrolledInBattle = "ENROLLED_IN_BATTLE",
  BattleInviteReceived = "BATTLE_INVITE_RECEIVED",
}

type SharedNotificationAttributes<NotifcationType extends NOTIFICATION_TYPES> =
  {
    seen: boolean;
    type: NotifcationType;
  };

export type TeamInviteReceivedNotificationResponse = StrapiEntity<
  SharedNotificationAttributes<NOTIFICATION_TYPES.TeamInviteReceived> & {
    team: StrapiRelation<
      StrapiEntity<TeamWithoutRelations & Pick<Team, "image">>
    >;
  }
>;

export type TransactionResultNotificationResponse = StrapiEntity<
  SharedNotificationAttributes<NOTIFICATION_TYPES.TransactionResult> & {
    transaction_result_details: {
      didFail: boolean;
      type: "deposit" | "withdraw";
      amount: number;
    };
  }
>;

export type EnrolledInBattleNotificationResponse = StrapiEntity<
  SharedNotificationAttributes<NOTIFICATION_TYPES.EnrolledInBattle> & {
    enrolled_in_battle_details: {
      battleId: number;
      teamId: number;
    };
  }
>;
export type BattleInviteReceivedNotificationResponse = StrapiEntity<
  SharedNotificationAttributes<NOTIFICATION_TYPES.BattleInviteReceived> & {
    battle_invite_received_details: {
      battleId: number;
      invitedTeamId: number;
      invitingTeamId: number;
      invitingTeamName: string;
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

  const { amount, type, didFail } =
    value.attributes?.transaction_result_details ?? {};

  return (
    isCorrectType &&
    typeof amount === "number" &&
    typeof type === "string" &&
    typeof didFail === "boolean"
  );
};

export const isEnrolledInBattleNotification = (
  v: unknown
): v is EnrolledInBattleNotificationResponse => {
  const value = v as EnrolledInBattleNotificationResponse;
  const isCorrectType =
    value.attributes.type === NOTIFICATION_TYPES.EnrolledInBattle;

  const { battleId, teamId } =
    value.attributes?.enrolled_in_battle_details ?? {};

  return (
    isCorrectType && typeof battleId === "number" && typeof teamId === "number"
  );
};

export const isBattleInviteReceivedNotification = (
  v: unknown
): v is BattleInviteReceivedNotificationResponse => {
  const value = v as BattleInviteReceivedNotificationResponse;
  const isCorrectType =
    value.attributes.type === NOTIFICATION_TYPES.BattleInviteReceived;

  const { battleId, invitedTeamId, invitingTeamId, invitingTeamName } =
    value.attributes?.battle_invite_received_details ?? {};

  return (
    isCorrectType &&
    typeof battleId === "number" &&
    typeof invitedTeamId === "number" &&
    typeof invitingTeamId === "number" &&
    typeof invitingTeamName === "string"
  );
};

export type NotificationResponse =
  | TeamInviteReceivedNotificationResponse
  | TransactionResultNotificationResponse
  | EnrolledInBattleNotificationResponse
  | BattleInviteReceivedNotificationResponse;

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
