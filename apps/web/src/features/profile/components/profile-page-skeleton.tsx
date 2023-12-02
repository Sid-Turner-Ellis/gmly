import { Skeleton } from "@/components/skeleton";
import { Heading } from "@/components/heading";
import { EditableImagePageSectionSkeleton } from "@/components/editable-image-page-section";
import { TableContainer } from "@/components/table";
import { TeamsTableSkeleton } from "./teams-table/teams-table";

export const ProfilePageSkeleton = () => {
  return (
    <div>
      <EditableImagePageSectionSkeleton />
      <TeamsTableSkeleton />
    </div>
  );
};
