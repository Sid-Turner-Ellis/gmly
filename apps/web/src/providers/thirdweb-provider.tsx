import {
  ThirdwebProvider as TWProvider,
  ThirdwebProviderProps,
  metamaskWallet,
  useChain,
  useChainId,
  useConnectionStatus,
  useNetworkMismatch,
  useSupportedChains,
  useSwitchChain,
} from "@thirdweb-dev/react";
import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { queryClient } from "./query-provider";
import { Localhost, Mumbai, Polygon } from "@thirdweb-dev/chains";
import { Modal } from "@/components/modal/modal";
import { toPascalCase } from "@/utils/to-pascal-case";
import { Button } from "@/components/button";
import { useAuth } from "@/hooks/use-auth";

/**
 * TODO: Explore this
 * - It allows us to change our chain but stay logged in
 * - It allows us to change our wallet but stay logged in. wrong - only when we switch to an account that isn't 'active'?
 */

const configForEnv = (): ThirdwebProviderProps<any> => {
  const env = process.env.NEXT_PUBLIC_APP_ENV;

  switch (env) {
    case "development":
      return {
        supportedChains: [Localhost],
        activeChain: "localhost",
      } as const;
    case "staging":
      return {
        supportedChains: [Mumbai],
        activeChain: "mumbai",
      } as const;

    case "production":
      return {
        supportedChains: [Polygon],
        activeChain: "polygon",
      } as const;
    default: {
      throw new Error("invalid env");
    }
  }
};

const SupportedGainGuard = ({ children }: PropsWithChildren<{}>) => {
  const isMismatch = useNetworkMismatch();
  const [isOpen, setIsOpen] = useState(false);
  const supportedChain = useSupportedChains()[0];
  const { logout, user } = useAuth();
  const switchChain = useSwitchChain();

  useEffect(() => {
    if (!user) return;
    setIsOpen(isMismatch);
  }, [isMismatch, user]);

  const onSwitch = () => {
    switchChain(supportedChain.chainId);
  };

  return (
    <>
      <Modal
        title="Unsupported Network"
        description={`Please switch to the ${supportedChain.name} network to continue using Gamerly`}
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        isClosable={false}
        Footer={
          <div className="flex justify-end gap-3">
            <Button variant={"secondary"} title="Cancel" onClick={logout} />
            <Button title="Switch" onClick={onSwitch} />
          </div>
        }
      />
      {children}
    </>
  );
};

export const ThirdwebProvider = ({ children }: { children: ReactNode }) => {
  const config = configForEnv();
  return (
    <TWProvider
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!}
      supportedWallets={[metamaskWallet()]}
      {...config}
      authConfig={{
        domain: "gamerly.app",
        authUrl: "/api/auth",
      }}
      queryClient={queryClient}
    >
      <SupportedGainGuard>{children}</SupportedGainGuard>
    </TWProvider>
  );
};
