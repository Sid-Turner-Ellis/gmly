import { AuthenticatedUser } from "@/hooks/use-auth";
import { useMemo, useState } from "react";
import { CreateGamerTagModal } from "./create-gamer-tag-modal";
import { Heading } from "@/components/heading";
import { PlusIconButton } from "@/components/plus-icon-button";

export const GamerTagSettings = ({
  gamerTags,
}: {
  gamerTags: AuthenticatedUser["data"]["profile"]["gamer_tags"];
}) => {
  const [isCreateGamerTagModalOpen, setIsCreateGamerTagModalOpen] =
    useState(false);

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
      <div className="flex gap-4 items-center ">
        <Heading variant="h3" className={"mb-0"}>
          Gamer tags
        </Heading>
        <PlusIconButton onClick={() => setIsCreateGamerTagModalOpen(true)} />
      </div>
    </div>
  );
};
