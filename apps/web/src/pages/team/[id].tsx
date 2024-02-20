import { ErrorPage } from "@/components/error-page";
import { TeamPageContent } from "@/features/team/components/team-page-content";
import { TeamPageSkeleton } from "@/features/team/components/team-page-skeleton";
import { TeamService } from "@/features/team/team-service";
import { AuthenticatedUser, useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

const getTeamProfileForTeam = (
  user: AuthenticatedUser | null,
  teamId: number
) => {
  if (!user || !user.data.profile.team_profiles.data) return null;

  const teamProfile = user.data.profile.team_profiles.data.find(
    (tp) => tp.attributes.team.data?.id === teamId
  );

  return teamProfile ?? null;
};

export default function TeamIdPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isUserLoading } = useAuth();
  const teamId =
    typeof id === "string" ? parseInt(id.replace(/\D/g, "")) : null;

  const {
    isLoading: isTeamLoading,
    data: teamData,
    isError: isTeamError,
    error,
    isLoadingError,
  } = useQuery(["team", teamId], async () => TeamService.getTeam(teamId!), {
    retry: false,
    enabled: !!teamId,
  });

  if (isTeamError) {
    return <ErrorPage type="notFound" />;
  }

  return (
    <div className="relative z-0">
      {(isTeamLoading || isUserLoading) && <TeamPageSkeleton />}
      {teamData?.data && (
        <TeamPageContent
          team={teamData.data}
          teamProfile={getTeamProfileForTeam(user, teamId!)}
        />
      )}
    </div>
  );
}
