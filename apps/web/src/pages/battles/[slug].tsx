import { GameCoverCard } from "@/features/game/components/game-cover-card";
import { Heading } from "@/components/heading";
import { GameResponse, GameService } from "@/features/game/game-service";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";
import { StrapiError } from "@/utils/strapi-error";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

export const getStaticPaths: GetStaticPaths = async () => {
  const games: GameResponse[] = [];

  const recursivelyFetchGames = async (page: number = 1) => {
    const response = await GameService.getGames(1);

    games.push(...response.data);

    if (page < response.meta.pagination.pageCount) {
      await recursivelyFetchGames(page + 1);
    }
  };
  await recursivelyFetchGames();

  return {
    paths: games.map((game) => ({
      params: { slug: game.attributes.slug },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps = (async (context) => {
  try {
    const game = await GameService.getGameBySlug(context.params!.slug);
    return { props: { game }, revalidate: 600 };
  } catch (error) {
    if (StrapiError.isStrapiError(error)) {
      if (error.error.status === 404) {
        return { notFound: true, revalidate: 600 };
      }
    }

    throw error;
  }
}) satisfies GetStaticProps<
  {
    game: GameResponse;
  },
  { slug: string }
>;

export default function BattlesSlugPage({
  game,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      <GameCoverCard url={resolveStrapiImage(game.attributes.cover_image)} />
      <Heading variant="h1" className="mt-6">
        {game.attributes.title}
      </Heading>
    </div>
  );
}
