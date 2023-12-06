import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import { useEffect, useState } from "react";

import { Image } from "@/components/image";
import { Button } from "@/components/button";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";
import {
  NotificationService,
  isTeamInviteReceivedNotification,
} from "@/features/notification/notification-service";
import { NotificationBell } from "@/features/notification/components/notification-bell";
import { useAuthenticatedQuery } from "@/hooks/use-authenticated-query";
import { useAuth } from "@/hooks/use-auth";
import { NotificationsModal } from "@/features/notification/components/notifications-modal";
import * as Popover from "@radix-ui/react-popover";
import { Cross2Icon, MixerHorizontalIcon } from "@radix-ui/react-icons";
import { NotificationsContent } from "@/features/notification/components/notifications-content";
import { useGlobalModal } from "@/providers/global-modal-provider";
import { ModalCard } from "@/components/modal/modal-card";

/**
 * Facets are like tags
 * You can create a facet for an index and have multiple products for that facet
 * They are essentially just groups for particular fields that are preoptimised so you dont need to search every document
 */
/**
 * Title goes in a page layout componnet
 * NOTE - We need to be updating the user cache whenever we change something relating to the profile
 *  - Maybe via the profile service - useProfile hook maybe
 */

/**
 * To create the API key use curl and then check the /keys endpoint with Authorization Bearer MASTER_KEY
 * 
 * curl -X POST 'http://localhost:7700/keys' \                                                                                                          ✔  10166  20:30:28
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer MASTER_KEY' \
  --data '{
    "description": "Search-only API key",
    "actions": ["search"],
    "indexes": ["*"],
    "expiresAt": null
  }'
 */

// 92ac19ae1d8e5e0a8b390ca408850e8e03b49c13de77c75c7612836f215c7989
export const getServerSideProps = async () => {
  return {
    props: {
      hideSidebar: false,
    },
  };
};

export default function Page() {
  return null;
}
