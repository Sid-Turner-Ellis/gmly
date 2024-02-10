import { AuthenticatedUser } from "@/hooks/use-auth";
import { useMemo, useState } from "react";
import { CreateGamerTagModal } from "./create-gamer-tag-modal";
import { Heading } from "@/components/heading";
import { IconButton } from "@/components/icon-button";
import { GamerTagEditRow } from "./gamer-tag-edit-row";
import { EditGamerTagModal } from "./edit-gamer-tag-modal";

export type GamerTagSettingsProps = {
  gamerTags: AuthenticatedUser["data"]["profile"]["gamer_tags"];
};

export const GamerTagSettings = ({ gamerTags }: GamerTagSettingsProps) => {
  const [isCreateGamerTagModalOpen, setIsCreateGamerTagModalOpen] =
    useState(false);
  const [editGamerTag, setEditGamerTag] = useState<
    NonNullable<GamerTagSettingsProps["gamerTags"]["data"]>[number] | null
  >(null);
  const gameIdsUserHasGamerTagsFor = useMemo(
    () =>
      (gamerTags.data
        ?.map((gamerTag) => gamerTag.attributes.game.data?.id)
        .filter(Boolean) as number[]) ?? [],
    [gamerTags]
  );

  return (
    <div>
      <CreateGamerTagModal
        isOpen={isCreateGamerTagModalOpen}
        closeModal={() => setIsCreateGamerTagModalOpen(false)}
        gameIdsToExclude={gameIdsUserHasGamerTagsFor}
      />
      <EditGamerTagModal
        closeModal={() => setEditGamerTag(null)}
        gamerTag={editGamerTag}
      />

      <div>
        <div className="flex gap-4 items-center ">
          <Heading variant="h3" className={"mb-0"}>
            Gamer tags
          </Heading>
          <IconButton
            icon="round-plus"
            onClick={() => setIsCreateGamerTagModalOpen(true)}
          />
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {gamerTags.data?.map((gamerTag) => (
            <GamerTagEditRow
              onEditClick={() => {
                setEditGamerTag(gamerTag);
              }}
              gamerTag={gamerTag}
            />
          ))}
        </div>
      </div>
    </div>
  );
};