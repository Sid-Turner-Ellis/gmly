import { useAuth } from "@/hooks/use-auth";
import { Button } from "../button";
import * as Avatar from "@radix-ui/react-avatar";
import { useTailwindBreakpoint } from "@/hooks/use-tailwind-breakpoint";
import { resolveStrapiImage } from "@/utils/resolve-strapi-image";
import { useEffect, useMemo, useState } from "react";
import { toUsdString } from "@/utils/to-usd-string";
import { useIsFetching, useQuery } from "@tanstack/react-query";
import { TransactionService } from "@/features/transaction/transaction-service";
import { Spinner } from "../spinner";
import { TransactionModal } from "@/features/transaction/components/transaction-modal";
import { usePendingBalance } from "@/hooks/use-pending-balance";

type ProfileButtonsProps = {};

export const ProfileButtons = ({}: ProfileButtonsProps) => {
  const { user, logout } = useAuth();
  const isDesktop = useTailwindBreakpoint("md");
  const { balance, isBalanceLoading, hasPendingBalance } = usePendingBalance();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const username = user?.data?.profile?.username ?? "User";

  return (
    <>
      <div className="absolute">
        <TransactionModal
          isOpen={isWalletModalOpen}
          closeModal={() => setIsWalletModalOpen(false)}
        />
      </div>
      <div className="relative z-0 flex h-full gap-2 lg:gap-3">
        <Button
          title={typeof balance === "number" ? toUsdString(balance) : undefined}
          onClick={() => setIsWalletModalOpen(true)}
          variant={"primary"}
          disabled={!user || isBalanceLoading || hasPendingBalance}
          icon={
            isDesktop &&
            (isBalanceLoading || hasPendingBalance ? (
              <Spinner className="w-full" />
            ) : (
              "exchange"
            ))
          }
        />

        <div className="h-full">
          <Button
            variant="secondary"
            title={isDesktop ? username ?? "Profile" : undefined}
            className="h-full"
            onClick={logout}
            icon={
              <Avatar.Root className="inline-flex items-center justify-center w-full h-full overflow-hidden rounded-full select-none">
                <Avatar.Image
                  className="h-full w-full rounded-[inherit] object-cover"
                  src={resolveStrapiImage(user?.data.profile?.avatar ?? null)}
                  alt={"Avatar"}
                />
                <Avatar.Fallback
                  className="flex text-black bg-pink-400  text-[13px] font-medium h-full w-full relative"
                  delayMs={600}
                >
                  <span className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                    {username[0].toUpperCase()}
                  </span>
                </Avatar.Fallback>
              </Avatar.Root>
            }
          />
        </div>
      </div>
    </>
  );
};
