import { GameCard } from "@/components/game-card";

import { GamesService } from "@/services/games";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import * as React from "react";
import { useState } from "react";
import { useQuery } from "react-query";

export const getStaticProps = async (context: GetStaticProps) => {
  try {
    const games = await GamesService.getGames();
    return { props: { games }, revalidate: 600 };
  } catch (error) {
    return {
      redirect: {
        destination: "/error",
        permanent: false,
      },
    };
  }
};

export default function Home({
  games,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data } = useQuery(["games", 1], () => GamesService.getGames(), {
    initialData: games,
  });

  return (
    <div>
      {data && (
        <div className="flex flex-wrap gap-8">
          {data.data.map((game) => (
            <GameCard
              key={game.id}
              url={`${process.env.NEXT_PUBLIC_API_URL}${game.attributes.card_image.data.attributes.url}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
