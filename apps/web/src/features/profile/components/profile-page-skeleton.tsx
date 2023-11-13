import { Skeleton } from "@/components/skeleton";
import { ProfilePageLayout } from "./profile-page-layout";
import { Heading } from "@/components/heading";

export const ProfilePageSkeleton = () => {
  return (
    <ProfilePageLayout
      Right={<Skeleton className="h-full w-full" type="image" />}
      LeftTop={<Skeleton className="w-56 h-11" />}
      LeftMiddle={<Skeleton className="w-72 h-4 my-2" />}
      LeftBottom={
        <>
          <Skeleton className="w-96 h-4 mb-2" />
          <Skeleton className="w-80 h-4 mb-2" />
          <Skeleton className="w-96 h-4" />
        </>
      }
    />
  );
};
