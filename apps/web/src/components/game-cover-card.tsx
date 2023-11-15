import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { Image } from "./image";

type GameCoverCardProps = {
  url: string;
};
export const GameCoverCard = ({ url }: GameCoverCardProps) => {
  return (
    <Image
      className={
        "aspect-[3/1] md:aspect-[4/1] lg:aspect-[6/1] rounded overflow-hidden shadow-md"
      }
      src={url}
      alt={url}
    />
  );
};
