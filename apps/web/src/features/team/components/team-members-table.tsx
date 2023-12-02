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
import { Skeleton } from "@/components/skeleton";
import {
  TableCell,
  TableContainer,
  TableImage,
  TableRow,
} from "@/components/table";
import { Badge } from "@/components/badge";

type TeamMembersTableProps = {
  team: TeamResponse;
};

// TODO: Create the skeleton
// export const TeamMembersTableSkeleton = () => <Skeleton />;

const GamerTag = ({ tag }: { tag: string }) => (
  <div className="inline-flex items-center gap-2 cursor-pointer text-brand-gray">
    <Text>{tag}</Text>
    <CopyIcon width={14} />
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
      <TableRow>
        <Text>Players</Text>
        <Text>Result</Text>
      </TableRow>
      {teamProfiles.map((profile, ind) => (
        <div>
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
        {isDesktop && <TableContentDesktop teamProfiles={teamProfiles} />}
        {!isDesktop && <TableContentMobile teamProfiles={teamProfiles} />}
      </>
    </TableContainer>
  );
};
