import { useAuth } from "@/hooks/use-auth";
import { useAuthenticatedQuery } from "@/hooks/use-authenticated-query";
import { NotificationService } from "./notification-service";
import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useNotifications = () => {
  const { user } = useAuth();
  const profileId = user?.data.profile.id;
  const queryClient = useQueryClient();

  const { data: unreadNotificationsData } = useAuthenticatedQuery(
    ["notifications", profileId],
    () => NotificationService.getUnreadNotificationsForProfile(profileId!),
    {
      enabled: !!profileId,
    }
  );

  const unreadNotifications = useMemo(
    () => unreadNotificationsData?.data ?? [],
    [unreadNotificationsData]
  );

  const invalidateNotifications = () => {
    queryClient.cancelQueries(["notifications", profileId]);
    queryClient.invalidateQueries(["notifications", profileId]);
  };

  const markAllAsRead = async () => {
    await Promise.all(
      unreadNotifications.map((n) => NotificationService.markAsRead(n.id))
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
    () => (unreadNotifications ?? []).some((n) => n.attributes.seen === false),
    [unreadNotifications]
  );
  return {
    unreadNotifications,
    markAllAsRead,
    markAsRead,
    invalidateNotifications,
    markAllAsSeen,
    hasUnseenNotifications,
  } as const;
};
