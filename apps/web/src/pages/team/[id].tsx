import { Button } from "@/components/button";
import { EditableImage } from "@/components/editable-image";
import { ErrorPage } from "@/components/error-page";
import { Heading } from "@/components/heading";
import { ProfilePageContent } from "@/features/profile/components/profile-page-content";
import { ProfilePageSkeleton } from "@/features/profile/components/profile-page-skeleton";
import { ProfileService } from "@/features/profile/profile-service";
import { TeamPageContent } from "@/features/team/components/team-page-content";
import { TeamPageSkeleton } from "@/features/team/components/team-page-skeleton";
import { TeamService } from "@/features/team/team-service";
import { AuthenticatedUser, useAuth } from "@/hooks/use-auth";
import { useStrapiImageUpload } from "@/hooks/use-strapi-image-upload";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactNode } from "react";

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
  } = useQuery(
    ["team", teamId],
    async () => {
      const teamResponse = await TeamService.getTeam(teamId!);
      return teamResponse.data;
    },
    {
      retry: false,
      enabled: !!teamId,
    }
  );

  if (isTeamError) {
    return <ErrorPage type="notFound" />;
  }

  return (
    <div className="relative z-0">
      {(isTeamLoading || isUserLoading) && <TeamPageSkeleton />}
      {teamData && (
        <TeamPageContent
          team={teamData}
          teamProfile={getTeamProfileForTeam(user, teamId!)}
        />
      )}
    </div>
  );
}
