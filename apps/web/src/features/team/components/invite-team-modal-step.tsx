import { Button } from "@/components/button";
import { Image } from "@/components/image";
import { ImageInput } from "@/components/image-input";
import { SearchDropdown } from "@/components/search-dropdown/search-dropdown";
import { Select } from "@/components/select";
import { TextInput } from "@/components/text-input";
import { useStrapiImageUpload } from "@/hooks/use-strapi-image-upload";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";
import { UseFormReturn } from "react-hook-form";
import { TeamMemberInvite } from "../types";
import { useSearchDropdown } from "@/hooks/use-search-dropdown";
import { globalMelilisearchIndex } from "@/lib/meilisearch";
import { StrapiImage } from "@/types/strapi-types";
import { TeamRoles } from "../team-service";
import { Text } from "@/components/text";
import { Icon } from "@/components/icon";
import { Skeleton } from "@/components/skeleton";
import { TeamMemberInviteItem } from "./team-member-invite-item";

type ContentProps = {
  maxMembers: number;
  teamMemberInvites: TeamMemberInvite[];
  setTeamMemberInvites: React.Dispatch<
    React.SetStateAction<TeamMemberInvite[]>
  >;
};

type FooterProps = {
  onSubmit: () => void;
  setIsFirstStep: React.Dispatch<React.SetStateAction<boolean>>;
};

const Content = ({
  teamMemberInvites,
  setTeamMemberInvites,
  maxMembers,
}: ContentProps) => {
  const { results, isNoResults, ...searchDropdownProps } = useSearchDropdown(
    "global-profiles",
    async (query) => {
      const searchResult = await globalMelilisearchIndex.search(query, {
        attributesToSearchOn: ["name"],
        limit: 4,
        filter: ["collection_type = profiles"],
        sort: ["name:asc"],
      });

      return searchResult.hits;
    }
  );

  const filteredResults = results.filter((h) => {
    const foundItem = teamMemberInvites.find((tmi) => tmi.userId === h.id);
    return !foundItem;
  });

  const inviteTeamMember = (
    userId: number,
    username: string,
    image: StrapiImage
  ) => {
    setTeamMemberInvites((prev) => [
      ...prev.filter((tmi) => tmi.userId !== userId),
      {
        userId,
        username,
        role: "member",
        image,
      } as TeamMemberInvite,
    ]);
  };

  const updateTeamMemberRole = (userId: number, newRole: TeamRoles) => {
    const teamMemberInvite = teamMemberInvites.find(
      (tmi) => tmi.userId === userId
    );

    if (!teamMemberInvite) return;

    const withoutCurrentTeamMemberInvite = teamMemberInvites.filter(
      (tmi) => tmi.userId !== teamMemberInvite.userId
    );

    const updatedTeamMemberInvite = {
      ...teamMemberInvite,
      role: newRole,
    };

    setTeamMemberInvites([
      ...withoutCurrentTeamMemberInvite,
      updatedTeamMemberInvite,
    ]);
  };

  return (
    <div className="relative z-0">
      <SearchDropdown
        disabled={maxMembers === teamMemberInvites.length}
        renderItem={({ name, image }) => (
          <div className="flex items-center gap-3">
            <div className="w-[30px] h-[30px] relative rounded-sm overflow-hidden">
              <Image alt={name} src={resolveStrapiImage(image)} />
            </div>
            <Text className={"text-brand-white"}>{name}</Text>
          </div>
        )}
        inputClassName="bg-brand-navy"
        dropdownContainerClassName="bg-brand-navy"
        NoItemsFound={
          <Text className={"text-brand-white"}>No players found</Text>
        }
        placeholder="Search for a player"
        ItemSkeleton={
          <div className="flex items-center gap-3">
            <Icon
              icon="image"
              size={30}
              className="text-brand-navy-light animate-pulse"
            />
            <Skeleton className="w-full h-3" />
          </div>
        }
        onResultClick={(result) => {
          searchDropdownProps.setQuery("");
          inviteTeamMember(result.id, result.name, result.image);
        }}
        isNoResults={isNoResults || filteredResults.length === 0}
        results={filteredResults}
        {...searchDropdownProps}
      />

      <div className="relative flex flex-col gap-4 mt-4 -z-20">
        {teamMemberInvites.map((teamMemberInvite) => (
          <TeamMemberInviteItem
            {...teamMemberInvite}
            setRole={(role) =>
              updateTeamMemberRole(teamMemberInvite.userId, role)
            }
          />
        ))}
      </div>
    </div>
  );
};

const Footer = ({ setIsFirstStep, onSubmit }: FooterProps) => {
  return (
    <>
      <Button
        variant="secondary"
        title="Back"
        onClick={() => {
          setIsFirstStep(true);
        }}
      />
      <Button variant="primary" title="Create" onClick={onSubmit} />
    </>
  );
};

export const InviteTeamModalStep = {
  Content,
  Footer,
};
