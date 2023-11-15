import { Heading } from "@/components/heading";
import { ProfilePageContent } from "@/features/profile/components/profile-page-content";
import { ProfilePageSkeleton } from "@/features/profile/components/profile-page-skeleton";
import { ProfilesService } from "@/features/profile/profiles-service";
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
      const profileResponse = await ProfilesService.getProfileById(profileId!);
      return profileResponse.data;
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  return (
    <div className="relative z-0">
      {isLoading && <ProfilePageSkeleton />}
      {data && <ProfilePageContent profile={data} />}
    </div>
  );
}
