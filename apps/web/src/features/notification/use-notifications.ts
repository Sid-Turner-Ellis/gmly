import { useAuth } from "@/hooks/use-auth";
import { useAuthenticatedQuery } from "@/hooks/use-authenticated-query";
import {
  NotificationResponse,
  NotificationService,
} from "./notification-service";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useOptimisticMutation } from "@/hooks/use-optimistic-mutation";

export const useNotifications = () => {
  const { user } = useAuth();
  const profileId = user?.data.profile.id;
  const queryClient = useQueryClient();
  const queryKey = ["notifications", profileId];

  const { data: notificationsData } = useAuthenticatedQuery(
    queryKey,
    () => NotificationService.getNotificationsForProfile(profileId!),
    {
      enabled: !!profileId,
      staleTime: 1000 * 60 * 1,
    }
  );

  const setCacheNotificationsAsSeen = () => {
    queryClient.setQueryData<typeof notificationsData>(
      queryKey,
      (previousCacheValue) => {
        previousCacheValue?.data.forEach((v) => {
          v.attributes.seen = true;
        });
        return previousCacheValue;
      }
    );
  };

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
    setCacheNotificationsAsSeen();
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
    setCacheNotificationsAsSeen();
    await NotificationService.markAllAsSeen(profileId!);
    invalidateNotifications();
  };

  const hasUnseenNotifications = (notificationsData?.data ?? []).some(
    (n) => n.attributes.seen === false
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
