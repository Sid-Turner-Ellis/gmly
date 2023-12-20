import {
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { useMemo } from "react";

export const useGamerlyContract = () => {
  const { contract } = useContract(
    "0x4ed7c70F96B99c776995fB64377f0d4aB3B0e1C1"
  );

  const { data, isLoading: isBalanceLoading } = useContractRead(
    contract,
    "balance"
  );

  const {
    mutateAsync: deposit,
    isLoading: depositIsLoading,
    isError: depositIsError,
    error: depositError,
  } = useContractWrite(contract, "deposit");

  const {
    mutateAsync: withdraw,
    isLoading: withdrawIsLoading,
    isError: withdrawIsError,
    error: withdrawError,
  } = useContractWrite(contract, "withdraw");

  const balance = useMemo(() => data?._hex && parseInt(data?._hex), [data]);

  return {
    balance,
    isBalanceLoading,
    deposit,
    depositIsLoading,
    depositIsError,
    depositError,
    withdraw,
    withdrawIsLoading,
    withdrawIsError,
    withdrawError,
  } as const;
};
