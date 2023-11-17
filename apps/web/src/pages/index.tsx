import { GameCard, GameCardSkeleton } from "@/components/game-card";

import { GamesService } from "@/services/games";
import { useUser } from "@thirdweb-dev/react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import * as React from "react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { useRouter } from "next/router";
import { GradientCircle } from "@/components/gradient-circle";
import { Icon } from "@/components/icon";

export default function Home({}) {
  const router = useRouter();
  const { data, isLoading } = useQuery(
    ["games", 1],
    () => GamesService.getGames(1),
    {}
  );

  return (
    <div className="lg:mt-16">
      <div className="flex flex-col gap-8">
        <Heading variant="h1" className="mb-1">
          Your esports app for web3
        </Heading>
        <div className="flex gap-8">
          <div className="pr-8 border-r-2 border-brand-navy-accent-light">
            <Heading variant="h2" className="mb-1">
              240k
            </Heading>
            <Text>Players</Text>
          </div>
          <div className="pr-8 border-r-2 border-brand-navy-accent-light">
            <Heading variant="h2" className="mb-1">
              1M
            </Heading>
            <Text>Matches played</Text>
          </div>
          <div className="pr-8">
            <Heading variant="h2" className="mb-1">
              $10M
            </Heading>
            <Text>USDC wagered</Text>
          </div>
        </div>
        <Heading variant="h2" className="mb-1">
          All games
        </Heading>
        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-cols-max">
          {isLoading && (
            <>
              <GameCardSkeleton />
              <div className="hidden w-full h-full xs:block">
                <GameCardSkeleton />
              </div>
              <div className="hidden w-full h-full md:block">
                <GameCardSkeleton />
              </div>
              <div className="hidden w-full h-full lg:block">
                <GameCardSkeleton />
              </div>
            </>
          )}
          {data?.data &&
            data.data
              .slice(0, 4)
              .map((game) => <GameCard key={game.id} game={game} />)}
        </div>
        <Button
          className="self-end -mt-4"
          title="+ 12 more games"
          variant="secondary"
          onClick={() => router.push("/battles")}
          size="sm"
        />
      </div>
      <GradientCircle />
    </div>
  );
}
