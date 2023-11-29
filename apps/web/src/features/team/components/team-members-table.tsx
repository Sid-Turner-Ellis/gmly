import { Text } from "@/components/text";
import { TeamResponse } from "../team-service";
import { cn } from "@/utils/cn";
import { Image } from "@/components/image";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";
import { toPascalCase } from "@/utils/to-pascal-case";
import { useTailwindBreakpoint } from "@/hooks/use-tailwind-breakpoint";
import { PropsWithChildren, useMemo } from "react";
import { ClassValue } from "clsx";
import { CopyIcon } from "@radix-ui/react-icons";
import { convertToOrdinal } from "@/utils/convert-to-ordinal";

type TeamMembersTableProps = {
  team: TeamResponse;
};

const GamerTag = ({ tag }: { tag: string }) => (
  <div className="inline-flex items-center gap-2 cursor-pointer text-brand-gray">
    <Text>{tag}</Text>
    <CopyIcon width={14} />
  </div>
);

const Row = ({
  children,
  isDark,
  className,
}: PropsWithChildren<{ isDark?: boolean; className?: ClassValue }>) => (
  <div
    className={cn(
      "flex py-4 px-4 md:px-12 items-center justify-between",
      isDark && "bg-brand-navy-dark",
      className
    )}
  >
    {children}
  </div>
);

const TableContentDesktop = ({
  teamProfiles,
}: {
  teamProfiles: NonNullable<
    TeamMembersTableProps["team"]["attributes"]["team_profiles"]["data"]
  >;
}) => {
  return (
    <div className="grid grid-cols-1">
      <Row>
        <div className="w-[14%]">
          <Text className="">G Rank</Text>
        </div>
        <div className="w-[30%]">
          <Text>Player</Text>
        </div>
        <div className="w-[14%]">
          <Text className={"text-center"}>Tag</Text>
        </div>
        <div className="w-[14%]">
          <Text className={"text-center"}>Position</Text>
        </div>
        <div className="w-[14%]">
          <Text className={"text-center"}>Earnings</Text>
        </div>
        <div className="w-[14%]">
          <Text className={"text-center"}>XP</Text>
        </div>
        <div className="block md:hidden">
          <Text>Result</Text>
        </div>
      </Row>
      {teamProfiles.map((profile, ind) => (
        <Row isDark={ind % 2 === 0} key={ind}>
          <div className="w-[14%]">
            <Text className={""}>{profile.attributes.rank}</Text>
          </div>
          <div className="w-[30%]">
            <div className="flex items-center gap-4">
              <div className="w-[28px] h-[28px] relative rounded-sm overflow-hidden">
                <Image
                  alt={profile.attributes.profile.data?.attributes.username!}
                  src={resolveStrapiImage(
                    profile.attributes.profile.data?.attributes.avatar ?? null
                  )}
                />
              </div>
              <Text className="text-brand-white">
                {profile.attributes.profile.data?.attributes.username!}
              </Text>
            </div>
          </div>
          <div className="w-[14%] text-center">
            <GamerTag tag="gamerTag" />
          </div>
          <div className="w-[14%]">
            <Text className={"text-center"}>
              {toPascalCase(profile.attributes.role)}
            </Text>
          </div>
          <div className="w-[14%]">
            <Text className={"text-brand-primary text-center"}>
              $
              {profile.attributes.earnings.toLocaleString("en-US", {
                style: "decimal",
                maximumFractionDigits: 0,
              })}
            </Text>
          </div>
          <div className="w-[14%]">
            <Text className={"text-center"}>{profile.attributes.xp}</Text>
          </div>
        </Row>
      ))}
    </div>
  );
};
const TableContentMobile = ({
  teamProfiles,
}: {
  teamProfiles: NonNullable<
    TeamMembersTableProps["team"]["attributes"]["team_profiles"]["data"]
  >;
}) => {
  return (
    <div className="grid grid-cols-1">
      <Row>
        <Text>Players</Text>
        <Text>Result</Text>
      </Row>
      {teamProfiles.map((profile, ind) => (
        <div>
          <Row isDark={ind % 2 === 0}>
            <div className="flex items-center w-full gap-3">
              <div className="min-w-[40px] w-[40px] relative rounded overflow-hidden aspect-square">
                <Image
                  alt={profile.attributes.profile.data?.attributes.username!}
                  src={resolveStrapiImage(
                    profile.attributes.profile.data?.attributes.avatar ?? null
                  )}
                />
              </div>
              <div className="grid justify-between w-full grid-cols-2 gap-y-1 grow-1">
                <Text className="text-brand-white ">
                  {profile.attributes.profile.data?.attributes.username!}
                </Text>
                <Text className="justify-self-end">
                  <GamerTag tag="gamerTag" />
                </Text>
                <Text className={"justify-end"}>
                  {convertToOrdinal(profile.attributes.rank)}
                </Text>
                <Text className={"justify-self-end"}>
                  {toPascalCase(profile.attributes.role)}
                </Text>
              </div>
            </div>
          </Row>
        </div>
      ))}
    </div>
  );
};

export const TeamMembersTable = ({ team }: TeamMembersTableProps) => {
  const isDesktop = useTailwindBreakpoint("md", { fallback: true });

  const teamProfiles = useMemo(
    () =>
      team.attributes.team_profiles.data?.filter(
        (tp) => !tp.attributes.is_pending
      ) ?? [],
    [team]
  );

  return (
    <div className="overflow-hidden rounded shadow-md bg-brand-navy-light">
      <div>
        <Row className="my-4">
          <Text className="font-semibold text-brand-white text-md">
            <span className="hidden md:inline">{team.attributes.name} </span>
            Team members
          </Text>

          <div className="flex gap-3">
            <div className="px-2 py-[0px] text-sm rounded bg-[#cdfee1]">
              <p className="font-semibold text-brand-status-success-light">
                W {team.attributes.wins}
              </p>
            </div>
            <div className="font-semibold px-2 py-[0px] text-sm rounded bg-[#fedad9]">
              <p className="text-brand-status-error-light">
                L {team.attributes.losses}
              </p>
            </div>
          </div>
        </Row>
      </div>

      {isDesktop && <TableContentDesktop teamProfiles={teamProfiles} />}
      {!isDesktop && <TableContentMobile teamProfiles={teamProfiles} />}
    </div>
  );
};
