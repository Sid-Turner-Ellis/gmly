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

/**
 * contract address: 0xE831a22E1b09D2F25dae664BAe2EA45F8e257dd0
 *
 * 1. Show the amount of USDC in their wallet
 * 2. Interact with it
 */

export default function Page() {
  const [amount, setAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const usdcContract = useContract(USDC.address, USDC.abi);

  const { mutateAsync: approveMutateAsync } = useContractWrite(
    usdcContract.contract,
    "approve"
  );
  const address = useAddress();
  const usdcBalanceOf = useContractRead(usdcContract.contract, "balanceOf", [
    address,
  ]);
  const usdcBalanceOfSmartContract = useContractRead(
    usdcContract.contract,
    "balanceOf",
    [GAMERLY.address]
  );
  const usdcAllowance = useContractRead(usdcContract.contract, "allowance", [
    address,
    GAMERLY.address,
  ]);

  const usdcAllowanceAmount = useMemo(() => {
    if (usdcAllowance.data) {
      const { _hex } = usdcAllowance.data;
      return parseInt(_hex, 16) / Math.pow(10, 6);
    }

    return 0;
  }, [usdcAllowance.data]);

  const usdcBalance = useMemo(() => {
    if (usdcBalanceOf.data) {
      const { _hex } = usdcBalanceOf.data;
      return parseInt(_hex, 16) / Math.pow(10, 6);
    }

    return 0;
  }, [usdcBalanceOf.data]);

  const usdcBalanceOfContract = useMemo(() => {
    if (usdcBalanceOfSmartContract.data) {
      const { _hex } = usdcBalanceOfSmartContract.data;
      return parseInt(_hex, 16) / Math.pow(10, 6);
    }

    return 0;
  }, [usdcBalanceOfSmartContract.data]);

  return (
    <div className="text-white">
      <div className="text-whiteAlpha-900">
        <p> Current wallet address: {address}</p>
        <p> Current allowance for smart contract: ${usdcAllowanceAmount}</p>
        <p> Current USDC balance: ${usdcBalance}</p>
      </div>
      <div>
        <input
          className="text-black"
          type="number"
          onChange={(e) => {
            setAmount(parseInt(e.target.value));
          }}
        />
        <button
          className="p-2 bg-slate-800"
          onClick={async () => {
            // const usdcFormat = amount * 1000000;
            // const res = await approveMutateAsync({
            //   args: [GAMERLY.address, usdcFormat],
            // });
            // console.log(res);
            const strapiRes = await strapiApi.request(
              "post",
              `/transactions/deposit`,
              {
                data: {
                  data: {
                    amount: amount,
                  },
                },
              }
            );
            console.log(strapiRes);
          }}
        >
          Approve for spending
        </button>
      </div>
      {/* <div>
        <button
          className="p-2 bg-slate-800"
          onClick={async () => {
            deposit();
          }}
        >
          Make the deposit
        </button>
      </div> */}
      <div>
        <p> balance of smart contract: ${usdcBalanceOfContract}</p>
      </div>
      {/* <div>
        <input onChange={(e) => setWithdrawAmount(parseInt(e.target.value))} />
        <button
          className="p-2 bg-slate-800"
          onClick={async () => {
            const res = await strapiApi.request(
              "post",
              `/transactions/withdraw`,
              {
                data: {
                  data: {
                    amount: withdrawAmount,
                  },
                },
              }
            );
            console.log(res);
          }}
        >
          Withdraw ${withdrawAmount}
        </button>
      </div> */}
    </div>
  );
}

const USDC = {
  address: process.env.NEXT_PUBLIC_USDC_SMART_CONTRACT_ADDRESS,
  abi: [
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "_spender", type: "address" },
        { name: "_value", type: "uint256" },
      ],
      name: "approve",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ name: "_account", type: "address" }],
      name: "unBlacklist",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "_from", type: "address" },
        { name: "_to", type: "address" },
        { name: "_value", type: "uint256" },
      ],
      name: "transferFrom",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ name: "minter", type: "address" }],
      name: "removeMinter",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "_name", type: "string" },
        { name: "_symbol", type: "string" },
        { name: "_currency", type: "string" },
        { name: "_decimals", type: "uint8" },
        { name: "_masterMinter", type: "address" },
        { name: "_pauser", type: "address" },
        { name: "_blacklister", type: "address" },
        { name: "_owner", type: "address" },
      ],
      name: "initialize",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "masterMinter",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "unpause",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "_to", type: "address" },
        { name: "_amount", type: "uint256" },
      ],
      name: "mint",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ name: "_amount", type: "uint256" }],
      name: "burn",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "minter", type: "address" },
        { name: "minterAllowedAmount", type: "uint256" },
      ],
      name: "configureMinter",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ name: "_newPauser", type: "address" }],
      name: "updatePauser",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "paused",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ name: "account", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [],
      name: "pause",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ name: "minter", type: "address" }],
      name: "minterAllowance",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "owner",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "pauser",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [
        { name: "_to", type: "address" },
        { name: "_value", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ name: "_newMasterMinter", type: "address" }],
      name: "updateMasterMinter",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ name: "account", type: "address" }],
      name: "isMinter",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ name: "_newBlacklister", type: "address" }],
      name: "updateBlacklister",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "blacklister",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        { name: "owner", type: "address" },
        { name: "spender", type: "address" },
      ],
      name: "allowance",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: true,
      inputs: [],
      name: "currency",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: false,
      inputs: [{ name: "_account", type: "address" }],
      name: "blacklist",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [{ name: "_account", type: "address" }],
      name: "isBlacklisted",
      outputs: [{ name: "", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "minter", type: "address" },
        { indexed: true, name: "to", type: "address" },
        { indexed: false, name: "amount", type: "uint256" },
      ],
      name: "Mint",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "burner", type: "address" },
        { indexed: false, name: "amount", type: "uint256" },
      ],
      name: "Burn",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "minter", type: "address" },
        { indexed: false, name: "minterAllowedAmount", type: "uint256" },
      ],
      name: "MinterConfigured",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [{ indexed: true, name: "oldMinter", type: "address" }],
      name: "MinterRemoved",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [{ indexed: true, name: "newMasterMinter", type: "address" }],
      name: "MasterMinterChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [{ indexed: true, name: "_account", type: "address" }],
      name: "Blacklisted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [{ indexed: true, name: "_account", type: "address" }],
      name: "UnBlacklisted",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [{ indexed: true, name: "newBlacklister", type: "address" }],
      name: "BlacklisterChanged",
      type: "event",
    },
    { anonymous: false, inputs: [], name: "Pause", type: "event" },
    { anonymous: false, inputs: [], name: "Unpause", type: "event" },
    {
      anonymous: false,
      inputs: [{ indexed: true, name: "newAddress", type: "address" }],
      name: "PauserChanged",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "owner", type: "address" },
        { indexed: true, name: "spender", type: "address" },
        { indexed: false, name: "value", type: "uint256" },
      ],
      name: "Approval",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: false, name: "previousOwner", type: "address" },
        { indexed: false, name: "newOwner", type: "address" },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "from", type: "address" },
        { indexed: true, name: "to", type: "address" },
        { indexed: false, name: "value", type: "uint256" },
      ],
      name: "Transfer",
      type: "event",
    },
  ],
};

const GAMERLY = {
  address: process.env.NEXT_PUBLIC_GAMERLY_SMART_CONTRACT_ADDRESS,
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "target",
          type: "address",
        },
      ],
      name: "AddressEmptyCode",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "implementation",
          type: "address",
        },
      ],
      name: "ERC1967InvalidImplementation",
      type: "error",
    },
    {
      inputs: [],
      name: "ERC1967NonPayable",
      type: "error",
    },
    {
      inputs: [],
      name: "FailedInnerCall",
      type: "error",
    },
    {
      inputs: [],
      name: "InsufficientAllowance",
      type: "error",
    },
    {
      inputs: [],
      name: "InsufficientBalance",
      type: "error",
    },
    {
      inputs: [],
      name: "InvalidInitialization",
      type: "error",
    },
    {
      inputs: [],
      name: "NotInitializing",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "OwnableInvalidOwner",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "OwnableUnauthorizedAccount",
      type: "error",
    },
    {
      inputs: [],
      name: "TransactionIdAlreadyExists",
      type: "error",
    },
    {
      inputs: [],
      name: "TransferFailed",
      type: "error",
    },
    {
      inputs: [],
      name: "UUPSUnauthorizedCallContext",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "bytes32",
          name: "slot",
          type: "bytes32",
        },
      ],
      name: "UUPSUnsupportedProxiableUUID",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "uint64",
          name: "version",
          type: "uint64",
        },
      ],
      name: "Initialized",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "implementation",
          type: "address",
        },
      ],
      name: "Upgraded",
      type: "event",
    },
    {
      inputs: [],
      name: "UPGRADE_INTERFACE_VERSION",
      outputs: [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "transactionId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "profileAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "deposit",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "transactionId",
          type: "uint256",
        },
      ],
      name: "getTransaction",
      outputs: [
        {
          components: [
            {
              internalType: "uint256",
              name: "id",
              type: "uint256",
            },
            {
              internalType: "enum Gamerly.TransactionType",
              name: "transactionType",
              type: "uint8",
            },
            {
              internalType: "address",
              name: "profileAddress",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "valid",
              type: "bool",
            },
          ],
          internalType: "struct Gamerly.Transaction",
          name: "transaction",
          type: "tuple",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getTransactionIds",
      outputs: [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_usdcAddress",
          type: "address",
        },
      ],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "proxiableUUID",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newImplementation",
          type: "address",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      name: "upgradeToAndCall",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "transactionId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "profileAddress",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "withdraw",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "withdrawToOwner",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};
