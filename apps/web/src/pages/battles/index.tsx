import { ErrorPage } from "@/components/error-page";
import {
  GamesGrid,
  GamesGridSkeleton,
} from "@/features/game/components/games-grid";
import { GradientCircle } from "@/components/gradient-circle";
import { Heading, headingVariants } from "@/components/heading";
import { GameService, GetGamesSort } from "@/features/game/game-service";
import { useQuery } from "@tanstack/react-query";
import * as SelectPrimitive from "@radix-ui/react-select";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { textVariantClassnames } from "@/components/text";
import { Icon } from "@/components/icon";

const getSortTitle = (sort: GetGamesSort) =>
  `Sort by ${sort === "title" ? "A-Z" : "Most recent"}`;

export default function BattlesIndexPage() {
  const [sort, setSort] = useState<GetGamesSort>("date");
  const [superficiallyLoading, setSuperficiallyLoading] = useState(false);
  const { data, isLoading, isError } = useQuery(
    ["games", sort, 1],
    () => GameService.getGames(1, sort),
    {}
  );

  useEffect(() => {
    setSuperficiallyLoading(true);
    let timer = setTimeout(() => {
      setSuperficiallyLoading(false);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [sort]);

  if (isError) {
    return <ErrorPage type="somethingWentWrong" />;
  }

  return (
    <div>
      <GradientCircle />
      <div className="flex gap-4 mb-10">
        <Heading variant="h1" className={"mb-0"}>
          All games
        </Heading>
        <SelectPrimitive.Root
          value={sort}
          onValueChange={(v) => {
            setSort(v as GetGamesSort);
          }}
        >
          <SelectPrimitive.Trigger
            className={cn(
              "min-w-min outline-none focus:outline-none flex items-center gap-3",
              textVariantClassnames.p
            )}
          >
            <SelectPrimitive.Value />
            <SelectPrimitive.Icon asChild>
              <Icon icon="chevron-down" size={12} />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content
              className="z-50"
              position="popper"
              sideOffset={2}
              side="bottom"
            >
              <SelectPrimitive.Viewport className="w-full overflow-hidden rounded bg-brand-navy-light">
                {["title", "date"].map((sortValue) => (
                  <SelectPrimitive.Item
                    value={sortValue}
                    key={sortValue}
                    className={cn(
                      textVariantClassnames.p,
                      "w-full gap-12 p-1 border-2 border-transparent transition-all bg-brand-navy-light  data-[highlighted]:outline-none data-[highlighted]:bg-white/5 outline-none"
                    )}
                  >
                    <SelectPrimitive.ItemText>
                      {getSortTitle(sortValue as GetGamesSort)}
                    </SelectPrimitive.ItemText>
                  </SelectPrimitive.Item>
                ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      </div>
      {(isLoading || superficiallyLoading) && <GamesGridSkeleton rows={3} />}
      {!isLoading && !superficiallyLoading && data && (
        <GamesGrid games={data.data} />
      )}
    </div>
  );
}
