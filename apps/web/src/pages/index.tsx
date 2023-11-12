// import { GameCard } from "@/components/game-card";

// import { GamesService } from "@/services/games";
// import { useUser } from "@thirdweb-dev/react";
// import { GetStaticProps, InferGetStaticPropsType } from "next";
// import * as React from "react";
// import { useState } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// export const getStaticProps = async (context: GetStaticProps) => {
//   try {
//     const games = await GamesService.getGames();
//     return { props: { games }, revalidate: 600 };
//   } catch (error) {
//     return {
//       redirect: {
//         destination: "/error",
//         permanent: false,
//       },
//     };
//   }
// };

// export default function Home({
//   games,
// }: InferGetStaticPropsType<typeof getStaticProps>) {
//   const { data } = useQuery(["games", 1], () => GamesService.getGames(), {
//     initialData: games,
//   });

//   return (
//     <div className="z-[999]">
//       {data && (
//         <div className="flex flex-wrap gap-8">
//           {data.data.map((game) => (
//             <GameCard
//               key={game.id}
//               url={`https://${process.env.NEXT_PUBLIC_STRAPI_HOSTNAME}${game.attributes.card_image.data.attributes.url}`}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

export default function Page() {
  return <div> index </div>;
}
