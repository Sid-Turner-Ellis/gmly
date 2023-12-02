import { Heading } from "@/components/heading";
import Switch from "@/components/switch";
import { Text } from "@/components/text";
import { tailwind } from "@/lib/tailwind";
import { useEffect, useState } from "react";
import * as Separator from "@radix-ui/react-separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfileService } from "@/features/profile/profile-service";
import { AuthenticatedUser, useAuth } from "@/hooks/use-auth";
import { produce } from "immer";
import { useToast } from "@/providers/toast-provider";
import { MeiliSearch } from "meilisearch";
import { set, useForm } from "react-hook-form";
import { useDebounce } from "@/hooks/use-debounce";
import NextImage from "next/image";
import { Image } from "@/components/image";
import { ErrorPage } from "@/components/error-page";
import { Modal } from "@/components/modal";
import { Button } from "@/components/button";
import { TeamService } from "@/features/team/team-service";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { Collapsable } from "@/components/collapsable";
import { GameService } from "@/features/game/game-service";
import { CreateTeamModal } from "@/features/team/components/create-team-modal/create-team-modal";
import { TextInput } from "@/components/text-input";
import { Select } from "@/components/select";
import { SearchDropdown } from "@/components/search-dropdown/search-dropdown";
import { useSearchDropdown } from "@/hooks/use-search-dropdown";
import { globalMelilisearchIndex } from "@/lib/meilisearch";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";
import { Icon } from "@/components/icon";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/utils/cn";
import { Pagination } from "@/components/pagination";
import { NotificationService } from "@/features/notification/notification-service";

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
  const [isOpen, setIsOpen] = useState(false);

  const [page, setPage] = useState(1);
  return (
    <div>
      <Button
        variant={"primary"}
        onClick={async () => {
          console.log("hit2");
          console.log(await NotificationService.markAsRead(1));
          // console.log(await NotificationService.markAllAsSeen(7));
        }}
        title="Get"
      />
    </div>
  );
}
