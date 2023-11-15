import { ReactNode, useEffect, useRef, useState } from "react";
import { InputLayout } from "../../../components/input-layout";
import { useQuery } from "@tanstack/react-query";
import { meilisearchClient } from "@/lib/meilisearch";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { StrapiImage } from "@/types";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";
import { Text } from "../../../components/text";
import { cn } from "@/utils/cn";
import { Skeleton } from "../../../components/skeleton";
import { GlobalIndexHit } from "../types";
import { GlobalSearchBarItemLayout } from "./global-search-bar-item-layout";
import { useKeyPress } from "@/hooks/use-key-press";
import { useRouter } from "next/router";
import { Image } from "@/components/image";

const globalIndex = meilisearchClient.index<GlobalIndexHit>("global");

export const GlobalSearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const focusRefs = useRef<any[]>([]);
  const [query, setQuery] = useState("");
  const [shouldShowLoader, setShouldShowLoader] = useState(false);
  const [cursor, setCursor] = useState(0);
  const router = useRouter();

  const { data, isLoading, isError, isPreviousData, isFetching } = useQuery(
    ["search", "global", query],
    async () => {
      const searchResult = await globalIndex.search(query, {
        attributesToSearchOn: ["name"],
        limit: 4,
        sort: ["collection_type:desc", "name:asc"],
      });

      return searchResult.hits;
    },
    {
      enabled: !!query,
      staleTime: 1000 * 60,
      keepPreviousData: true,
    }
  );

  const { registerRefForOutsideClick } = useOutsideClick(() =>
    setIsOpen(false)
  );

  // Superficially add a delay to the loading state
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isPreviousData || isFetching) {
      setShouldShowLoader(true);
      timer = setTimeout(() => {
        setShouldShowLoader(false);
      }, 350);
    }

    return () => {
      if ((isPreviousData || isFetching) && shouldShowLoader) {
        clearTimeout(timer);
      }
    };
  }, [isPreviousData, isFetching, shouldShowLoader]);

  useEffect(() => {
    const elementToFocus = focusRefs.current[cursor];

    if (elementToFocus?.focus && false) {
      elementToFocus.focus();
    }
  }, [cursor]);

  useKeyPress(
    (key) => {
      const maxCursor = data?.length ?? 0;
      if (key === "ArrowDown") {
        setCursor((prev) => (prev >= maxCursor ? 0 : prev + 1));
      }
      if (key === "ArrowUp") {
        setCursor((prev) => (prev <= 0 ? maxCursor : prev - 1));
      }
    },
    [data?.length]
  );

  const onSearchResultClick = (result: GlobalIndexHit) => {
    const baseRoute =
      result.collection_type === "games" ? "/battles" : "/profile";

    router.push(`${baseRoute}/${result.slug}`);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full h-full" ref={registerRefForOutsideClick()}>
      <InputLayout
        icon="search"
        className="w-full h-full"
        onClick={() => setIsOpen(true)}
      >
        <input
          type="text"
          ref={(node) => (focusRefs.current[0] = node)}
          value={query}
          placeholder="Search for games, profiles, tournaments and more..."
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-full bg-transparent outline-none focus:outline-none text-brand-white"
        />
      </InputLayout>

      {isOpen && !!query.length && (
        <div className="absolute w-full mt-3 overflow-hidden rounded top-full bg-brand-navy-light">
          {shouldShowLoader && !isLoading && (
            <GlobalSearchBarItemLayout
              Left={<Skeleton className="absolute inset-0 bg-brand-navy" />}
              Middle={<Skeleton className="w-56 h-3 bg-brand-navy" />}
              Right={<Skeleton className="w-16 h-3 bg-brand-navy" />}
            />
          )}
          {data?.map((searchResult, i) => (
            <GlobalSearchBarItemLayout
              key={`${searchResult.collection_type}:${searchResult.id}`}
              ref={(node) => (focusRefs.current[i + 1] = node)}
              Left={
                <Image
                  src={resolveStrapiImage(searchResult.image)}
                  alt={`${searchResult.collection_type}:${searchResult.name}`}
                />
              }
              Middle={searchResult.name}
              Right={
                searchResult.collection_type === "games" ? "Game" : "Profile"
              }
              onClick={() => onSearchResultClick(searchResult)}
            />
          ))}

          {isLoading && (
            <>
              <GlobalSearchBarItemLayout
                Left={<Skeleton className="absolute inset-0 bg-brand-navy" />}
                Middle={<Skeleton className="w-56 h-3 bg-brand-navy" />}
                Right={<Skeleton className="w-16 h-3 bg-brand-navy" />}
              />
              <GlobalSearchBarItemLayout
                Left={<Skeleton className="absolute inset-0 bg-brand-navy" />}
                Middle={<Skeleton className="w-40 h-3 bg-brand-navy" />}
                Right={<Skeleton className="h-3 w-28 bg-brand-navy" />}
              />
              <GlobalSearchBarItemLayout
                Left={<Skeleton className="absolute inset-0 bg-brand-navy" />}
                Middle={<Skeleton className="w-56 h-3 bg-brand-navy" />}
                Right={<Skeleton className="w-16 h-3 bg-brand-navy" />}
              />
            </>
          )}
          {!!query.length && !shouldShowLoader && !data?.length && (
            <GlobalSearchBarItemLayout
              Left={<Image src="/pakistani-man.gif" alt="No results found" />}
              Middle="No results found"
            />
          )}
        </div>
      )}
    </div>
  );
};
