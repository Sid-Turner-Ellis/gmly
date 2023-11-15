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

const client = new MeiliSearch({
  host: "http://127.0.0.1:7700",
  apiKey: "1388e149bf06841115849028ab1559d5c955dfd5e93f5288f7cae000cb53f8fc",
});
const index = client.index("global");

export default function Page() {
  const [query, setQuery] = useState("");
  const { data, isLoading, isError, isPreviousData, isFetching } = useQuery(
    ["search", "index-name", query],
    async () => {
      return index.search(query, {
        attributesToSearchOn: ["name"],
      });
    },
    {
      enabled: !!query,
      staleTime: 1000 * 60,
      keepPreviousData: true,
    }
  );

  /**
   * isLoading is when there is no data in the cache
   * isFetching is when there is no data in the cache AND when there is data in the cache but it is being refreshed
   *
   * So there are two concepts here:
   * 1. Stale time - the amount of time before refetching the cache
   * 2. Cache time - time before the ting deletes from the cache
   *
   * ------
   * for backspace we should not show the loading state. Actually yeah we should
   * If it's refetching then we should show the loading state. Regardless of whether its showing the previous data or not
   *
   *
   * - fetching and there are results:
   *  - Show results
   *  - if isFetching is true then show little loader
   *
   * The problem with showing the previous results is that if you add "Y" it will show the previous values that should now be filtered for
   * - if isFetching is true
   * - we should filter the previous data to match the current query
   * e.g.
   * {hits.map(h => isPreviousData ? filter the data by the term)}
   */

  const handleOnChange = (e: any) => {
    setQuery(e.target.value);
  };

  console.log({ isPreviousData, isFetching, isLoading, data, isError });

  return <></>;
}
