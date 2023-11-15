import { ProfilePageContent } from "@/features/profile/components/profile-page-content";
import { ProfilePageSkeleton } from "@/features/profile/components/profile-page-skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/router";
import { useMemo } from "react";

export default function ProfileIndexPage() {
  const { user, signIn, authStatus } = useAuth();

  if (authStatus === "unauthenticated") {
    signIn();
    return null;
  }

  const profile = useMemo(() => {
    if (user) {
      const { id, ...attributes } = user?.data.profile;
      return { id, attributes };
    }
  }, [user]);

  return (
    <div className="relative z-0">
      {authStatus === "loading" && <ProfilePageSkeleton />}
      {profile && <ProfilePageContent profile={profile} />}
    </div>
  );
}
