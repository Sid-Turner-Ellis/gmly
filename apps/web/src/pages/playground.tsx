import {
  useContract,
  useContractMetadata,
  useContractRead,
  useAddress,
  useContractWrite,
} from "@thirdweb-dev/react";
import { useEffect, useState, useMemo } from "react";
import BigNumber from "bignumber.js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { strapiApi } from "@/lib/strapi";
import { Button } from "@/components/button";
import { TransactionService } from "@/features/transaction/transaction-service";
import { useAuth } from "@/hooks/use-auth";
import { ProfileService } from "@/features/profile/profile-service";
import { TeamMemberEdit } from "@/features/team/components/team-member-edit";
import { TeamMemberUpdate } from "@/features/team/types";
import { SimpleSelect } from "@/components/simple-select";
import * as PopoverPrimitives from "@radix-ui/react-popover";
import { Text } from "@/components/text";
import { useRouter } from "next/router";
import { ModalCard } from "@/components/modal/modal-card";
import { useGlobalModal } from "@/providers/global-modal-provider";

/**
 * Facets are like tags
 * You can create a facet for an index and have multiple products for that facet
 * They are essentially just groups for particular fields that are preoptimised so you dont need to search every document
 */
/**
 * Title goes in a page layout componnet
 * NOTE - We need to be updating the user cache whenever we change something relating to the profile
 *  - Maybe via the profile service - useProfile hook maybe
 */

/**
 * To create the API key use curl and then check the /keys endpoint with Authorization Bearer MASTER_KEY
 * 
 * curl -X POST 'http://localhost:7700/keys' \                                                                                                          ✔  10166  20:30:28
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer MASTER_KEY' \
  --data '{
    "description": "Search-only API key",
    "actions": ["search"],
    "indexes": ["*"],
    "expiresAt": null
  }'
 */

export const getServerSideProps = async () => {
  return {
    props: {
      hideSidebar: false,
    },
  };
};

type TeamMemberEdit = {
  teamMemberInvites: TeamMemberUpdate[];
  allowOwnershipTransfer?: boolean;
  setTeamMemberInvites: React.Dispatch<
    React.SetStateAction<TeamMemberUpdate[]>
  >;
};

const mockData: TeamMemberUpdate[] = [
  {
    image: null,
    username: "test",
    userId: 1,
    isPending: false,
    role: "founder",
  },
  {
    image: null,
    username: "test2",
    userId: 2,
    isPending: false,
    role: "member",
  },
  {
    image: null,
    username: "test3",
    userId: 3,
    isPending: false,
    role: "member",
  },
];

type LogOutModalProps = {
  closeModal: () => void;
};

export const LogOutModal = ({ closeModal }: LogOutModalProps) => {
  const { logout } = useAuth();
  return (
    <ModalCard
      size={"sm"}
      title="Log out"
      description="Are you sure you want to log out?"
      Footer={
        <div className="flex items-center justify-end gap-3">
          <Button
            title="Cancel"
            variant={"secondary"}
            onClick={() => {
              closeModal();
            }}
          />
          <Button
            title="Log out"
            variant={"delete"}
            onClick={() => {
              // logout();
              closeModal();
            }}
          />
        </div>
      }
    />
  );
};

export default function Page() {
  const p = useAuth();
  const qc = useQueryClient();
  console.log(p);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { openModal, closeModal } = useGlobalModal();

  return (
    <div>
      <PopoverPrimitives.Root open={isOpen} onOpenChange={setIsOpen}>
        <PopoverPrimitives.Trigger>
          <Button
            className="h-full px-3.5"
            variant={"secondary"}
            onClick={() => {}}
            title="User profile"
          />
        </PopoverPrimitives.Trigger>
        <PopoverPrimitives.Portal>
          <PopoverPrimitives.Content
            className="will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
            sideOffset={14}
          >
            <div className="bg-brand-navy-light w-[var(--radix-popover-trigger-width)] rounded overflow-hidden cursor-pointer">
              <button
                className="py-2 px-3.5 text-left w-full group transition"
                onClick={() => {
                  setIsOpen(false);
                  router.push("/profile");
                }}
              >
                <Text className={"group-hover:text-brand-white"}>Profile</Text>
              </button>
              <button
                className="py-2 px-3.5 text-left w-full  bg-brand-red hover:bg-brand-red-dark transition"
                onClick={() => {
                  setIsOpen(false);
                  openModal(<LogOutModal closeModal={closeModal} />, {
                    isClosable: true,
                  });
                }}
              >
                <Text className={"text-brand-white"}>Log out</Text>
              </button>
            </div>
            <PopoverPrimitives.Arrow className="fill-brand-navy-light" />
          </PopoverPrimitives.Content>
        </PopoverPrimitives.Portal>
      </PopoverPrimitives.Root>

      <div className="mb-40" />
    </div>
  );
}
