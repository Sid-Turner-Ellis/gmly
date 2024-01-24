import { useAuth } from "@/hooks/use-auth";
import { useAuthenticatedQuery } from "@/hooks/use-authenticated-query";
import { NotificationService } from "./notification-service";
import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useNotifications = () => {
  const { user } = useAuth();
  const profileId = user?.data.profile.id;
  const queryClient = useQueryClient();

  const { data: notificationsData } = useAuthenticatedQuery(
    ["notifications", profileId],
    () => NotificationService.getNotificationsForProfile(profileId!),
    {
      enabled: !!profileId,
    }
  );

  const notifications = useMemo(
    () =>
      notificationsData?.data.sort(
        (n1, n2) =>
          new Date(n2.attributes.createdAt).getSeconds() -
          new Date(n1.attributes.createdAt).getSeconds()
      ) ?? [],
    [notificationsData]
  );

  const invalidateNotifications = () => {
    queryClient.cancelQueries(["notifications", profileId]);
    queryClient.invalidateQueries(["notifications", profileId]);
  };

  const markAllAsRead = async () => {
    await Promise.all(
      notifications.map((n) => NotificationService.markAsRead(n.id))
    );

    invalidateNotifications();
  };

  const markAsRead = async (id: number) => {
    await NotificationService.markAsRead(id);
    invalidateNotifications();
  };

  const markAllAsSeen = async () => {
    await NotificationService.markAllAsSeen(profileId!);
    invalidateNotifications();
  };

  const hasUnseenNotifications = useMemo(
    () => (notifications ?? []).some((n) => n.attributes.seen === false),
    [notifications]
  );
  return {
    notifications,
    markAllAsRead,
    markAsRead,
    invalidateNotifications,
    markAllAsSeen,
    hasUnseenNotifications,
  } as const;
};
