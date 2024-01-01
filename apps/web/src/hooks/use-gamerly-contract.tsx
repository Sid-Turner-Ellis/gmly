import {
  useContract,
  useContractRead,
  useContractWrite,
} from "@thirdweb-dev/react";
import { useMemo } from "react";

export const useGamerlyContract = () => {
  const { contract } = useContract(
    "0x4A679253410272dd5232B3Ff7cF5dbB88f295319"
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
