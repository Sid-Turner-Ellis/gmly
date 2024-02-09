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

export default function Page() {
  const p = useAuth();

  useEffect(() => {
    async function exec() {
      const t = await ProfileService.getProfile(
        "0x5F5E88C273260D8D3AF3dB8026551daE05838dE2"
      );
      console.log("profile", t);
    }

    exec();
  }, []);
  return <div></div>;
}
