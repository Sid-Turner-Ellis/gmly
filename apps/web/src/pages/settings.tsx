import { useAuth } from "@/hooks/use-auth";
import { queryClient } from "@/providers/query-provider";

export default function Page() {
  const { user } = useAuth(true);
  return (
    <div>
      <h1> settings Page - {user?.data.profile.region} </h1>
    </div>
  );
}
