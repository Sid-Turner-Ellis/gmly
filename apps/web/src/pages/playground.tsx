import { Heading } from "@/components/heading";
import Switch from "@/components/switch";
import { Text } from "@/components/text";
import { tailwind } from "@/lib/tailwind";
import { useEffect, useState } from "react";
import * as Separator from "@radix-ui/react-separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfilesService } from "@/features/profile/profiles-service";
import { AuthenticatedUser, useAuth } from "@/hooks/use-auth";
import { produce } from "immer";
import { useToast } from "@/providers/toast-provider";
import { MeiliSearch } from "meilisearch";
import { set } from "react-hook-form";
import { useDebounce } from "@/hooks/use-debounce";
import NextImage from "next/image";
import { Image } from "@/components/image";
import { ErrorPage } from "@/components/error-page";
import { Modal } from "@/components/modal";

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
  const [index, setIndex] = useState(0);
  const urls = [
    "https://picsum.photos/203/303",
    "https://picsum.photos/303/303",
    "https://picsum.photos/403/303",
    "https://picsum.photos/503/303",
    "https://picsum.photos/603/303",
    "https://picsum.photos/703/303",
  ];
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <div>
      <h1 className="text-4xl text-white font-grotesque">hello mate</h1>
      <Modal title="hello boi" isOpen={isOpen} setIsOpen={setIsOpen}>
        <div>
          <Heading variant="h2">holloooo</Heading>
          <h1 className="text-4xl text-white font-grotesque">hello mate</h1>
          <Text className={"font-grotesque text-3xl text-white"}>
            hello mate
          </Text>
        </div>
      </Modal>
    </div>
  );
  // return (
  //   <div>
  //     <button onClick={() => setIndex((p) => p + 1)}> increase url </button>
  //     <div className="h-56 w-80">
  //       <NextImage src={urls[index]} alt="shit" />
  //     </div>
  //   </div>
  // );
}
