import {
  useContract,
  useContractMetadata,
  useContractRead,
  useAddress,
  useContractWrite,
} from "@thirdweb-dev/react";
import { useEffect, useState, useMemo } from "react";
import BigNumber from "bignumber.js";
import { useMutation } from "@tanstack/react-query";
import { strapiApi } from "@/lib/strapi";
import { Button } from "@/components/button";
import { TransactionService } from "@/features/transaction/transaction-service";

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
  return (
    <div>
      <Button
        onClick={() => {
          for (let i = 0; i < 10; i++) {
            if (i === 0) {
              TransactionService.deposit(69);
            }
            TransactionService.deposit(1);
            TransactionService.deposit(1);
            TransactionService.deposit(1);
          }
        }}
      >
        {" "}
        Rapid withdraw{" "}
      </Button>
    </div>
  );
}
