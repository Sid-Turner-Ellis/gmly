import { GameCoverCard } from "@/features/game/components/game-cover-card";
import { Heading } from "@/components/heading";
import { GameResponse, GameService } from "@/features/game/game-service";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";
import { StrapiError } from "@/utils/strapi-error";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { AuthenticatedUser, useAuth } from "@/hooks/use-auth";
import { BattlesPageContent } from "@/features/battle/components/battles-page-content";

export const getStaticPaths: GetStaticPaths = async () => {
  const games = await GameService.recursivelyGetGames();

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
  const { user, authStatus, signIn } = useAuth();

  if (authStatus === "unauthenticated") {
    signIn();
    return null;
  }

  return (
    <div>
      <GameCoverCard url={resolveStrapiImage(game.attributes.cover_image)} />
      <Heading variant="h1" className="mt-6">
        {game.attributes.title}
      </Heading>

      {user && <BattlesPageContent user={user} game={game} />}
    </div>
  );
}
