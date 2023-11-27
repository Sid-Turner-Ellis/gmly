import { Image } from "@/components/image";
import { TeamRoles } from "../team-service";
import { TeamMemberInvite } from "../types";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";
import { Text } from "@/components/text";
import { SimpleSelect } from "@/components/simple-select";

export const TeamMemberInviteItem = ({
  image,
  username,
  role,
  setRole,
}: { setRole: (role: TeamRoles) => void } & Pick<
  TeamMemberInvite,
  "image" | "username" | "role"
>) => {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="w-[30px] h-[30px] relative rounded-sm overflow-hidden">
          <Image alt={username} src={resolveStrapiImage(image)} />
        </div>
        <Text className={"text-brand-white"}>{username}</Text>
      </div>
      <div>
        <SimpleSelect
          disabled={role === "founder"}
          placeholder="founder"
          options={["founder", "leader", "member"]}
          disabledOptions={["founder"]}
          value={role}
          setValue={(v) => {
            setRole(v as TeamRoles);
          }}
        />
      </div>
    </div>
  );
};
