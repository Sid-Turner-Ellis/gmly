import { useEffect, useState } from "react";
import { Modal } from "./modal/modal";
import { Text, textVariantClassnames } from "./text";
import { Button } from "./button";
import { cn } from "@/utils/cn";
import { useContract, useContractRead } from "@thirdweb-dev/react";
import { useGamerlyContract } from "@/hooks/use-gamerly-contract";
import { useToast } from "@/providers/toast-provider";

type WalletModalProps = {
  isOpen: boolean;
  closeModal: () => void;
};

export const WalletModal = ({ isOpen, closeModal }: WalletModalProps) => {
  const [isWithdraw, setIsWithdraw] = useState(false);
  const [amount, setAmount] = useState(0);
  const { addToast } = useToast();
  const {
    deposit,
    depositIsError,
    depositIsLoading,
    depositError,
    withdraw,
    withdrawIsLoading,
    withdrawIsError,
    withdrawError,
  } = useGamerlyContract();
  const isLoading = withdrawIsLoading || depositIsLoading;

  useEffect(() => {
    if (withdrawIsError || depositIsError) {
      const errorMessage =
        (withdrawError as any)?.reason ?? (depositError as any)?.reason;

      addToast({
        type: "error",
        message:
          errorMessage ?? "Something went wrong. Please try again later.",
      });
    }
  }, [withdrawIsError, depositIsError]);

  useEffect(() => {
    setAmount(0);
  }, [isWithdraw, isOpen]);

  const onConfirm = async () => {
    try {
      if (isWithdraw) {
        await withdraw({ args: [amount] });
      } else {
        await deposit({ args: [amount] });
      }
      addToast({
        type: "success",
        message: "Transaction successful.",
      });
    } catch (error) {
    } finally {
      closeModal();
    }
  };

  return (
    <div className="text-white">
      <Modal
        isLoading={isLoading}
        title={isWithdraw ? "Withdraw" : "Deposit"}
        description="Deposit USDC into Gamerly and withdraw anytime."
        isOpen={isOpen}
        isClosable
        closeModal={closeModal}
        Top={
          <div className="inline-flex border mb-3 border-solid border-brand-navy-light-accent-light rounded overflow-hidden p-[4px] items-center bg-brand-navy -ml-1">
            <Text
              onClick={() => setIsWithdraw(false)}
              className={cn(
                "px-5 cursor-pointer text-brand-white py-2 transition rounded",
                !isWithdraw && "bg-brand-navy-accent-light"
              )}
            >
              Deposit
            </Text>

            <Text
              onClick={() => setIsWithdraw(true)}
              className={cn(
                "px-5 cursor-pointer text-brand-white py-2 transition rounded",
                isWithdraw && "bg-brand-navy-accent-light"
              )}
            >
              Withdraw
            </Text>
          </div>
        }
        Footer={
          <div className="flex items-center justify-end gap-3">
            <Button title="Cancel" variant={"secondary"} onClick={closeModal} />
            <Button
              title="Confirm"
              variant={"primary"}
              disabled={amount < 1}
              onClick={onConfirm}
            />
          </div>
        }
      >
        <div>
          <div className="inline-flex p-[2px] bg-brand-navy rounded overflow-hidden">
            <div>
              <Text className="py-2 px-2.5 font-medium bg-brand-navy-accent-light rounded-l">
                $
              </Text>
            </div>
            <input
              onChange={(e) => {
                const inputWithNumbersOnly = e.target.value.replace(
                  /[^0-9]/g,
                  ""
                );
                const parsedNumber = parseInt(inputWithNumbersOnly);
                const number = Number.isNaN(parsedNumber) ? 0 : parsedNumber;
                setAmount(number);
              }}
              value={amount}
              className={cn(
                textVariantClassnames.p,
                "bg-transparent outline-none text-emerald-400 px-2.5 w-24"
              )}
              type="text"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
