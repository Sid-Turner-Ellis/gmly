import { TeamResponse } from "@/features/team/team-service";
import { cn } from "@/utils/cn";
import { Dispatch, SetStateAction, useMemo } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { Image } from "@/components/image";
import { Text } from "@/components/text";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";

export const TeamSelectionRow = ({
  teamSelection,
  teamProfile,
  setTeamSelection,
  teamSize,
  totalWagerAmountInCents,
}: {
  teamSelection: number[];
  teamProfile: NonNullable<
    TeamResponse["attributes"]["team_profiles"]["data"]
  >[number];
  setTeamSelection: Dispatch<SetStateAction<number[]>>;
  teamSize: number;
  totalWagerAmountInCents: number;
}) => {
  const profile = teamProfile.attributes.profile.data?.attributes;
  const avatar = profile?.avatar;
  const username = profile?.username!;
  const wagerModeEnabled = profile?.wager_mode;
  const trustModeEnabled = profile?.trust_mode;
  const balance = profile?.balance ?? 0;
  console.log("profile", profile);
  const isSelected = teamSelection.includes(teamProfile.id);

  const disabledReason = useMemo(() => {
    const canAddMorePlayers = teamSelection.length + 1 < teamSize;
    const hasRequiredBalance = balance >= totalWagerAmountInCents / teamSize;

    if (!canAddMorePlayers && !isSelected) {
      return "Team selection is full";
    }

    if (!hasRequiredBalance) {
      return "User has insufficient balance";
    }

    if (
      totalWagerAmountInCents > 0 &&
      (!wagerModeEnabled || !trustModeEnabled)
    ) {
      return "User has not enabled wager or trust mode";
    }
  }, [
    teamSelection,
    teamSize,
    balance,
    totalWagerAmountInCents,
    wagerModeEnabled,
    trustModeEnabled,
  ]);

  return (
    <div
      className={cn(
        "flex justify-between items-center",
        !!disabledReason && "opacity-50"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-[30px] h-[30px] relative rounded-sm overflow-hidden">
          <Image alt={username} src={resolveStrapiImage(avatar)} />
        </div>
        <Text className={"text-brand-white"}>{username}</Text>
      </div>
      <div>
        <Tooltip.Provider>
          <Tooltip.Root delayDuration={0}>
            <Tooltip.Trigger asChild>
              <button
                disabled={!!disabledReason}
                className={cn(
                  "px-1.5 py-0.5 rounded disabled:cursor-not-allowed text-sm",
                  isSelected &&
                    "bg-brand-status-error-light text-brand-status-error-dark [&:not(:disabled)]:hover:bg-brand-status-error-light/90 transition",
                  !isSelected &&
                    "bg-brand-status-success-light text-bg-brand-status-success-light [&:not(:disabled)]:hover:bg-brand-status-success-light/90 transition"
                )}
                onClick={() => {
                  if (isSelected) {
                    setTeamSelection((prev) =>
                      prev.filter((tpId) => tpId !== teamProfile.id)
                    );
                  } else {
                    setTeamSelection((prev) => [...prev, teamProfile.id]);
                  }
                }}
              >
                {isSelected ? "Remove" : "Add"}
              </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              {!!disabledReason && (
                <Tooltip.Content
                  className="data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade select-none rounded-[4px] bg-brand-navy px-[15px] py-[10px] text-[14px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] text-brand-gray"
                  sideOffset={5}
                  side="left"
                >
                  {disabledReason}
                  <Tooltip.Arrow className="fill-brand-navy" />
                </Tooltip.Content>
              )}
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    </div>
  );
};
