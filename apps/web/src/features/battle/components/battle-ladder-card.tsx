import { GameResponse } from "@/features/game/game-service";
import { BattleResponse } from "../battle-service";
import { Skeleton } from "@/components/skeleton";
import { getRelativeStartTime } from "../util";
import { Text } from "@/components/text";
import { Button } from "@/components/button";
import { Image } from "@/components/image";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";

export const BattleLadderCard = ({
  isMobile,
  battle,
  game,
  onClick,
}: Partial<{
  isMobile: boolean;
  game: GameResponse;
  battle: BattleResponse;
  onClick: () => void;
}>) => {
  if (!battle || !game || !onClick)
    return (
      <Skeleton className="rounded px-3 py-3">
        <div className="w-11 h-11" />
      </Skeleton>
    );

  const startsIn = getRelativeStartTime(battle.attributes.date);
  const teamSizeText = `${battle.attributes.match_options.team_size}v${battle.attributes.match_options.team_size}`;
  const seriesText = `Best of ${battle.attributes.match_options.series}`;
  const gameMode =
    battle.attributes.match_options.custom_attribute_inputs.find(
      (cu) => cu.attribute_id === "game_mode"
    )?.value ?? "Unknown";
  const region = battle.attributes.match_options.region;

  const wagerText =
    battle.attributes.wager_amount > 0
      ? battle.attributes.wager_amount / 100 + " USDC"
      : "XP Match";

  const description = (
    isMobile
      ? [teamSizeText, seriesText, region, startsIn]
      : [teamSizeText, seriesText]
  ).join(" • ");

  return (
    <div className="bg-brand-navy-light rounded px-3 py-3">
      {isMobile ? (
        <div className="flex justify-between gap-4 items-center">
          <div className="w-[67%] xs:w-[70%]">
            <Text variant="label" className={"text-brand-white mb-2"}>
              {gameMode}
            </Text>
            <Text className={"text-xs"}>{description}</Text>
          </div>

          <div className="w-[33%] xs:w-[30%]">
            <Button className="w-full" title={wagerText} />
          </div>
        </div>
      ) : (
        <div className="flex items-center">
          <div className="w-[56%]">
            <div className="flex gap-4 items-center">
              <Image
                className="w-11 h-11 rounded overflow-hidden"
                alt={game.attributes.title}
                src={resolveStrapiImage(game.attributes.square_image)}
              />
              <div>
                <Text variant="label" className={"text-brand-white mb-1"}>
                  {gameMode}
                </Text>
                <Text className={"text-xs"}>{description}</Text>
              </div>
            </div>
          </div>
          <div className="w-[14%]">
            <Text className={"text-brand-white"}>{startsIn}</Text>
          </div>
          <div className="w-[14%]">
            <Text className={"text-brand-white"}>{region}</Text>
          </div>

          <div className="w-[14%]">
            <Button className="w-full" title={wagerText} />
          </div>
        </div>
      )}
    </div>
  );
};
