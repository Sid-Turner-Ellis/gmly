import { ErrorPage } from "@/components/error-page";
import { Heading } from "@/components/heading";
import { ProfilePageContent } from "@/features/profile/components/profile-page-content";
import { ProfilePageSkeleton } from "@/features/profile/components/profile-page-skeleton";
import { ProfileService } from "@/features/profile/profile-service";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

// TODO: Sort out the error state for this

export default function ProfileIdPage() {
  const router = useRouter();
  const { id } = router.query;
  const profileId =
    typeof id === "string" ? parseInt(id.replace(/\D/g, "")) : null;

  const { isLoading, data, isError, error, isLoadingError } = useQuery(
    ["profile", profileId],
    async () => {
      const profileResponse = await ProfileService.getProfileById(profileId!);
      return profileResponse.data;
    },
    {
      retry: false,
      enabled: !!profileId,
    }
  );

  if (isError) {
    return <ErrorPage type="notFound" />;
  }

  return (
    <div className="relative z-0">
      {isLoading && <ProfilePageSkeleton />}
      {data && <ProfilePageContent profile={data} />}
    </div>
  );
}
