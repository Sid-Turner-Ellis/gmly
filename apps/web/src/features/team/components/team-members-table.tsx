import { Text } from "@/components/text";
import { TeamResponse } from "../team-service";
import { Image } from "@/components/image";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";
import { toPascalCase } from "@/utils/to-pascal-case";
import { useTailwindBreakpoint } from "@/hooks/use-tailwind-breakpoint";
import { PropsWithChildren, ReactNode, useMemo } from "react";
import { convertToOrdinal } from "@/utils/convert-to-ordinal";
import {
  TableCell,
  TableContainer,
  TableImage,
  TableRow,
} from "@/components/table";
import { Badge } from "@/components/badge";
import { GamerTag } from "./gamer-tag";
import { Skeleton } from "@/components/skeleton";
import { Clickable } from "@/components/clickable";

type TeamMembersTableProps = {
  team: TeamResponse;
};

const DesktopTableRows = ({
  teamProfiles,
}: {
  teamProfiles: NonNullable<
    TeamMembersTableProps["team"]["attributes"]["team_profiles"]["data"]
  >;
}) => {
  return (
    <div className="grid grid-cols-1">
      <TableRow>
        <TableCell className="w-[14%]">
          <Text className="">G Rank</Text>
        </TableCell>
        <TableCell className="w-[30%]">
          <Text>Player</Text>
        </TableCell>

        <TableCell className="w-[14%]" isCentered>
          <Text>Tag</Text>
        </TableCell>

        <TableCell className="w-[14%]" isCentered>
          <Text>Position</Text>
        </TableCell>

        <TableCell className="w-[14%]" isCentered>
          <Text>Earnings</Text>
        </TableCell>

        <TableCell className="w-[14%]" isCentered>
          <Text>XP</Text>
        </TableCell>
      </TableRow>
      {teamProfiles.map((profile, ind) => (
        <Clickable action={`/profile/${profile.attributes.profile.data?.id}`}>
          <TableRow isDark={ind % 2 === 0} key={ind}>
            <TableCell className="w-[14%]">
              <Text>{profile.attributes.rank}</Text>
            </TableCell>

            <TableCell className="w-[30%]">
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
            </TableCell>

            <TableCell className="w-[14%]" isCentered>
              <GamerTag tag="gamerTag" />
            </TableCell>

            <TableCell className="w-[14%]" isCentered>
              <Text>{toPascalCase(profile.attributes.role)}</Text>
            </TableCell>

            <TableCell className="w-[14%]" isCentered>
              <Text className={"text-brand-primary text-center"}>
                $
                {profile.attributes.earnings.toLocaleString("en-US", {
                  style: "decimal",
                  maximumFractionDigits: 0,
                })}
              </Text>
            </TableCell>

            <TableCell className="w-[14%]" isCentered>
              <Text className={"text-center"}>{profile.attributes.xp}</Text>
            </TableCell>
          </TableRow>
        </Clickable>
      ))}
    </div>
  );
};

const MobileTableRows = ({
  teamProfiles,
}: {
  teamProfiles: NonNullable<
    TeamMembersTableProps["team"]["attributes"]["team_profiles"]["data"]
  >;
}) => {
  return (
    <div className="grid grid-cols-1">
      <TableRow>
        <Text>Players</Text>
        <Text>Result</Text>
      </TableRow>
      {teamProfiles.map((profile, ind) => (
        <div key={ind}>
          <TableRow isDark={ind % 2 === 0}>
            <div className="flex items-center w-full gap-3">
              <TableImage
                alt={profile.attributes.profile.data?.attributes.username!}
                src={resolveStrapiImage(
                  profile.attributes.profile.data?.attributes.avatar ?? null
                )}
              />
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
          </TableRow>
        </div>
      ))}
    </div>
  );
};

export const TeamMembersTableSkeleton = () => (
  <div className="mt-8">
    <TableContainer title={<Skeleton dark className="w-96 h-8 max-w-[80%]" />}>
      <TableRow>
        <Skeleton className="w-[80%] h-3" dark />
      </TableRow>
      <TableRow isDark>
        <Skeleton className="w-[60%] h-3" dark />
      </TableRow>
      <TableRow>
        <Skeleton className="w-[80%] h-3" dark />
      </TableRow>
      <TableRow isDark>
        <Skeleton className="w-[60%] h-3" dark />
      </TableRow>
    </TableContainer>
  </div>
);

export const TeamMembersTable = ({ team }: TeamMembersTableProps) => {
  const isDesktop = useTailwindBreakpoint("md", { fallback: true });
  const tableTitle = `${isDesktop ? team.attributes.name : ""} Team members`;

  const teamProfiles = useMemo(
    () =>
      team.attributes.team_profiles.data?.filter(
        (tp) => !tp.attributes.is_pending
      ) ?? [],
    [team]
  );

  return (
    <TableContainer
      title={tableTitle}
      Right={
        <div className="flex gap-2">
          <Badge colorScheme={"emerald"}>W {team.attributes.wins}</Badge>
          <Badge colorScheme={"rose"}>L {team.attributes.losses}</Badge>
        </div>
      }
    >
      <>
        {isDesktop && <DesktopTableRows teamProfiles={teamProfiles} />}
        {!isDesktop && <MobileTableRows teamProfiles={teamProfiles} />}
      </>
    </TableContainer>
  );
};
