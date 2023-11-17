import { GameResponse } from "@/services/games";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";
import { Image } from "./image";
import { Skeleton } from "./skeleton";
import { ReactNode } from "react";
import { Text, TextSkeleton } from "./text";
import Link from "next/link";

type GameCardProps = {
  game: GameResponse;
};

export const GameCardLayout = ({
  children,
}: {
  children: [ReactNode, ReactNode];
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="rounded overflow-hidden relative aspect-[4/5]">
        {children[0]}
      </div>
      <div>{children[1]}</div>
    </div>
  );
};
export const GameCardSkeleton = () => {
  return (
    <GameCardLayout>
      <Skeleton type="image" className="w-full h-full" />
      <TextSkeleton className="w-[75%]" />
    </GameCardLayout>
  );
};

export const GameCard = ({ game }: GameCardProps) => (
  <Link href={`/battles/${game.attributes.slug}`}>
    <GameCardLayout>
      <Image
        src={resolveStrapiImage(game.attributes.card_image)}
        alt={game.attributes.title}
      />
      <Text className={"text-brand-white font-semibold font-grotesque"}>
        {game.attributes.title}
      </Text>
    </GameCardLayout>
  </Link>
);
