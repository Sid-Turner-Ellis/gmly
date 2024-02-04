import { Heading } from "@/components/heading";
import {
  isTeamInviteReceivedNotification,
  isTransactionResultNotification,
} from "../notification-service";
import { Text } from "@/components/text";
import { useEffect, useState } from "react";
import { useNotifications } from "../use-notifications";
import { useRouter } from "next/router";
import { NotificationItem } from "./notification-item";
import { ClassValue } from "clsx";
import { cn } from "@/utils/cn";
import { useAuth } from "@/hooks/use-auth";
import { toUsdString } from "@/utils/to-usd-string";

type NotificationsContent = {
  onNotificationClick?: () => void;
  onMarkAllReadClick?: () => void;
  className?: ClassValue;
};

export const NotificationsContent = ({
  onMarkAllReadClick,
  onNotificationClick,
  className,
}: NotificationsContent) => {
  const {
    notifications,
    markAllAsRead,
    markAllAsSeen,
    hasUnseenNotifications,
  } = useNotifications();
  const router = useRouter();
  const { user } = useAuth();

  const totalNotifications = notifications.length;

  useEffect(() => {
    if (hasUnseenNotifications) {
      markAllAsSeen();
    }
  }, []);

  return (
    <>
      <div
        className={cn("bg-brand-navy-light rounded shadow h-full", className)}
      >
        <div className="relative">
          <div className="flex items-center justify-between px-3 py-4">
            <Heading variant={"h3"} className={"mb-0"}>
              Notifications
            </Heading>
            <button
              onClick={() => {
                onMarkAllReadClick?.();
                markAllAsRead();
              }}
              className="bg-[#CBBEFF] transition hover:bg-[#cbbeffcf] font-semibold rounded-xl text-sm py-[2px] px-3 text-brand-primary-dark"
            >
              Mark read
            </button>
          </div>
          <div className="absolute left-0 w-full bottom-0 bg-white/10 h-[1px]" />
        </div>

        {!notifications?.length && (
          <Text className="px-3 py-4">No notifications</Text>
        )}

        <div>
          {notifications?.map((notification, index) => {
            const isFinalNotification = index === totalNotifications - 1;
            if (isTeamInviteReceivedNotification(notification)) {
              return (
                <NotificationItem
                  key={notification.id}
                  onNotificationClick={() => {
                    if (isTeamInviteReceivedNotification(notification)) {
                      const teamUrl = `/team/${notification.attributes.team.data?.id}`;

                      if (router.asPath === teamUrl) {
                        router.reload();
                      }
                      router.push(teamUrl);
                    }

                    onNotificationClick?.();
                  }}
                  notification={notification}
                  image={notification.attributes.team.data?.attributes.image}
                  hideBottomBorder={isFinalNotification}
                >
                  You have been invited to join the{" "}
                  <strong>
                    {notification.attributes.team.data?.attributes.name}
                  </strong>{" "}
                  team
                </NotificationItem>
              );
            }

            if (isTransactionResultNotification(notification)) {
              const { type, amount, didFail } =
                notification.attributes.transaction_result_details;
              return (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  image={user?.data.profile.avatar!}
                  hideBottomBorder={isFinalNotification}
                >
                  Your{" "}
                  <strong>
                    {type === "withdraw" ? "withdrawal" : "deposit"}
                  </strong>{" "}
                  of {toUsdString(amount)}{" "}
                  <strong>{didFail ? "failed" : "succeeded"}</strong>
                </NotificationItem>
              );
            }

            return null;
          })}
        </div>
      </div>
    </>
  );
};
