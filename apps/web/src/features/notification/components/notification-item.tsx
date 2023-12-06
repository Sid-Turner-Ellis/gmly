/**
 * The tet content
 * the notification ID to remove it
 * When the notifcation was clicked
 * the image
 * the action
 *
 */

import { StrapiImageResponse } from "@/types/strapi-types";
import { PropsWithChildren } from "react";
import { NotificationResponse } from "../notification-service";
import { Image } from "@/components/image";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";
import { Text } from "@/components/text";
import { timeAgo } from "../util";
import { useNotifications } from "../use-notifications";

type NotificationItemProps = PropsWithChildren<{
  onNotificationClick?: () => void;
  image?: StrapiImageResponse;
  notification: NotificationResponse;
  hideBottomBorder?: boolean;
}>;

export const NotificationItem = ({
  image,
  hideBottomBorder,
  onNotificationClick,
  notification,
  children,
}: NotificationItemProps) => {
  const { markAsRead } = useNotifications();

  return (
    <div className="relative z-90">
      <div className="py-4 px-3">
        <div className="flex gap-4 items-center">
          <div className="min-w-[34px] min-h-[34px] h-[34px] w-[34px] rounded-full overflow-hidden">
            <Image
              alt={`Notification thumbnail for ${notification.id}`}
              src={resolveStrapiImage(image)}
            />
          </div>
          <div className="grow w-full">
            <Text className={"mb-1"}>{children}</Text>
            <Text className={"text-xs text-brand-primary"}>
              {timeAgo(notification.attributes.createdAt)}
            </Text>
          </div>
          <div className="flex ml-4 justify-end">
            <button
              onClick={() => {
                onNotificationClick?.();
                markAsRead(notification.id);
              }}
              className="text-xs text-brand-white bg-brand-navy py-2 px-3 rounded transition hover:bg-brand-navy/80"
            >
              View
            </button>
          </div>
        </div>
        {!hideBottomBorder && (
          <div className="absolute left-0 w-full bottom-0 bg-white/10 h-[1px] " />
        )}
      </div>
    </div>
  );
};
