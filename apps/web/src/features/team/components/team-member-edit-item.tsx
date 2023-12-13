import { Image } from "@/components/image";
import { TeamRoles } from "../team-service";
import { TeamMemberUpdate } from "../types";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";
import { Text } from "@/components/text";
import { SimpleSelect } from "@/components/simple-select";

// We disable it according to the role rather than
export const TeamMemberEditItem = ({
  image,
  username,
  role,
  setRole,
  disabled,
  allowOwnershipTransfer,
}: {
  setRole: (role: TeamRoles) => void;
  disabled?: boolean;
  allowOwnershipTransfer?: boolean;
} & Pick<TeamMemberUpdate, "image" | "username" | "role">) => {
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
          disabled={disabled || role === "founder"}
          placeholder="founder"
          options={[
            {
              option: "Ownership",
              icon: "crown",
              optionClassName: "cursor-pointer",
            },
            "founder",
            "leader",
            "member",
            {
              option: "Remove",
              optionClassName:
                "bg-brand-red data-[highlighted]:bg-brand-red-dark text-brand-white cursor-pointer",
            },
          ]}
          disabledOptions={[
            "founder",
            allowOwnershipTransfer ? "" : "Ownership",
          ]}
          value={role}
          setValue={(v) => {
            setRole(v as TeamRoles);
          }}
        />
      </div>
    </div>
  );
};
