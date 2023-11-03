type GameCardProps = {
  url: string;
};
export const GameCard = ({ url }: GameCardProps) => (
  <div className="cursor-pointer overflow-hidden h-auto rounded-xl shadow-md aspect-[175/220] max-w-[210px]">
    <img className="object-cover h-full" src={url} />
  </div>
);
