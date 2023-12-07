import { Heading } from "@/components/heading";
import { isTeamInviteReceivedNotification } from "../notification-service";
import { Text } from "@/components/text";
import { useEffect, useState } from "react";
import { useNotifications } from "../use-notifications";
import { useRouter } from "next/router";
import { NotificationItem } from "./notification-item";
import { ClassValue } from "clsx";
import { cn } from "@/utils/cn";

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
          <div className="flex justify-between items-center py-4 px-3">
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
          <Text className="py-4 px-3">No notifications</Text>
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

            return null;
          })}
        </div>
      </div>
    </>
  );
};
