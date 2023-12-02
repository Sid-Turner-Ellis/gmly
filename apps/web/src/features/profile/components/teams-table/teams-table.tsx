import { Badge } from "@/components/badge";
import { Clickable } from "@/components/clickable";
import { Pagination } from "@/components/pagination";
import { Skeleton } from "@/components/skeleton";
import {
  TableCell,
  TableContainer,
  TableImage,
  TableImageSkeleton,
  TableRow,
} from "@/components/table";
import { Text } from "@/components/text";
import { TeamService } from "@/features/team/team-service";
import { useTailwindBreakpoint } from "@/hooks/use-tailwind-breakpoint";
import { cn } from "@/utils/cn";
import { convertToOrdinal } from "@/utils/convert-to-ordinal";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";
import { useQuery } from "@tanstack/react-query";
import { ClassValue } from "clsx";
import { ReactNode, useState } from "react";

type TeamsTableProps = {
  profileId: number;
};

const DesktopTableRow = ({
  children,
  className,
  isDark,
}: {
  children: [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode];
  className?: ClassValue;
  isDark?: boolean;
}) => (
  <TableRow className={cn(className)} isDark={isDark}>
    <TableCell className={"w-[10%]"}>{children[0]}</TableCell>
    <TableCell className={"w-[35%] lg:w-[45%]"}>{children[1]}</TableCell>
    <TableCell isCentered className={"w-[10%]"}>
      {children[2]}
    </TableCell>
    <TableCell isCentered className={"w-[10%]"}>
      {children[3]}
    </TableCell>
    <TableCell isCentered className={"w-[25%] lg:w-[15%]"}>
      {children[4]}
    </TableCell>
    <TableCell
      isCentered
      className={"w-[10%] flex justify-center items-center"}
    >
      {children[5]}
    </TableCell>
  </TableRow>
);

const DesktopTableRowSkeleton = ({ isDark }: { isDark?: boolean }) => (
  <DesktopTableRow className="gap-3" isDark={isDark}>
    <Skeleton className="w-full h-3" dark={!isDark} />
    <div className="flex gap-2 items-center ">
      <TableImageSkeleton isDark={!isDark} />
      <Skeleton className="w-full h-3" dark={!isDark} />
    </div>
    <Skeleton className="w-full h-3" dark={!isDark} />
    <Skeleton className="w-full h-3" dark={!isDark} />
    <Skeleton className="w-full h-3" dark={!isDark} />
    <Skeleton className="w-full h-3" dark={!isDark} />
  </DesktopTableRow>
);

const MobileTableRowSkeleton = ({ isDark }: { isDark?: boolean }) => (
  <TableRow isDark={isDark}>
    <div className="flex gap-6 items-center justify-between w-full">
      <div className="flex gap-2 items-center">
        <TableImageSkeleton isDark={!isDark} />
        <div className="flex flex-col gap-2">
          <Skeleton className="w-28 h-3" dark={!isDark} />
          <Skeleton className="w-20 h-2.5" dark={!isDark} />
        </div>
      </div>
      <Skeleton className="w-40 h-3.5" dark={!isDark} />
    </div>
  </TableRow>
);

const MobileTableRows = ({
  isLoading,
  teams,
  pageSize,
}: {
  isLoading: boolean;
  teams?: Awaited<ReturnType<typeof TeamService.getTeamsForProfile>>;
  pageSize: number;
}) => (
  <>
    <TableRow>
      <TableCell className="xs:w-[65%]">
        <Text>Rank</Text>
      </TableCell>
      <TableCell isCentered className="xs:w-[35%]">
        <Text>Win/Loss</Text>
      </TableCell>
    </TableRow>
    {isLoading && (
      <>
        {Array.from({ length: pageSize }).map((_, index) => (
          <MobileTableRowSkeleton isDark={index % 2 === 0} />
        ))}
      </>
    )}
    {!isLoading &&
      (teams?.data ?? []).map((team, index) => (
        <Clickable action={`/team/${team.id}`}>
          <TableRow isDark={index % 2 === 0}>
            <div className="flex gap-2 xs:w-[65%]">
              <TableImage
                alt={team.attributes.game.data?.attributes.title ?? "Game"}
                src={resolveStrapiImage(team.attributes.image)}
              />

              <div className="flex flex-col gap-2">
                <Text className="text-brand-white">{team.attributes.name}</Text>
                <Text>
                  {convertToOrdinal(Math.floor(Math.random() * 1000))}
                </Text>
              </div>
            </div>

            <div className="xs:w-[35%]">
              <div className="flex gap-2 justify-center items-center">
                <Badge colorScheme="emerald">W 150</Badge>
                <Badge colorScheme="rose">L 23</Badge>
              </div>
            </div>
          </TableRow>
        </Clickable>
      ))}
  </>
);

const DesktopTableRows = ({
  isLoading,
  teams,
  pageSize,
}: {
  isLoading: boolean;
  teams?: Awaited<ReturnType<typeof TeamService.getTeamsForProfile>>;
  pageSize: number;
}) => (
  <>
    <DesktopTableRow>
      <Text>Rank</Text>
      <Text>Team</Text>
      <Text> Win rate </Text>
      <Text>Total XP</Text>
      <Text>Record</Text>
      <Text>Game</Text>
    </DesktopTableRow>
    {isLoading && (
      <>
        {Array.from({ length: pageSize }).map((_, index) => (
          <DesktopTableRowSkeleton isDark={index % 2 === 0} />
        ))}
      </>
    )}
    {!isLoading &&
      (teams?.data ?? []).map((team, index) => (
        <Clickable action={`/team/${team.id}`}>
          <DesktopTableRow isDark={index % 2 === 0}>
            <Text>{Math.floor(Math.random() * 10)}</Text>
            <div className={"w-[35%] lg:w-[45%] flex gap-4 items-center"}>
              <TableImage
                alt={team.attributes.game.data?.attributes.title ?? "Game"}
                src={resolveStrapiImage(team.attributes.image)}
              />
              <Text className="text-brand-white">{team.attributes.name}</Text>
            </div>
            <Text className="text-brand-white">{team.attributes.name}</Text>
            <Text>{Math.floor(Math.random() * 1000)}</Text>
            <div className="flex gap-2 justify-center items-center">
              <Badge colorScheme="emerald">W 150</Badge>
              <Badge colorScheme="rose">L 23</Badge>
            </div>
            <TableImage
              alt={team.attributes.game.data?.attributes.title ?? "Game"}
              src={resolveStrapiImage(
                team.attributes.game.data?.attributes.card_image
              )}
            />
          </DesktopTableRow>
        </Clickable>
      ))}
  </>
);

export const TeamsTable = ({ profileId }: TeamsTableProps) => {
  const pageSize = 3;
  const isDesktop = useTailwindBreakpoint("md", { fallback: true });
  const [page, setPage] = useState(1);
  const { data: teamsData, isLoading: teamDataIsLoading } = useQuery(
    ["teams-for-profile", profileId, page],
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return TeamService.getTeamsForProfile(profileId, page, pageSize);
    },
    {
      enabled: !!profileId,
    }
  );

  return (
    <div className="flex flex-col gap-4 mt-8">
      <TableContainer title="Teams">
        <>
          {isDesktop && (
            <DesktopTableRows
              teams={teamsData}
              isLoading={teamDataIsLoading}
              pageSize={pageSize}
            />
          )}

          {!isDesktop && (
            <MobileTableRows
              teams={teamsData}
              isLoading={teamDataIsLoading}
              pageSize={pageSize}
            />
          )}
        </>
      </TableContainer>
      <div className="self-end">
        <Pagination
          page={page}
          setPage={setPage}
          maxPages={teamsData?.meta.pagination.pageCount ?? 1}
        />
      </div>
    </div>
  );
};
