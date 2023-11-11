import Image from "next/image";

type GameCardProps = {
  url: string;
};

export const GameCard = ({ url }: GameCardProps) => (
  <div className="cursor-pointer overflow-hidden h-auto rounded-xl shadow-md aspect-[175/220] max-w-[210px]">
    {/* <Image
      width={50}
      height={50}
      className="object-cover h-full"
      src={url}
      alt=""
    /> */}
  </div>
);
