import {
  ThirdwebProvider as TWProvider,
  metamaskWallet,
} from "@thirdweb-dev/react";
import { ReactNode } from "react";
import { queryClient } from "./query-provider";

export const ThirdwebProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TWProvider
      activeChain="goerli"
      clientId="dd889be01a6b364576a50984107b357d"
      supportedWallets={[metamaskWallet()]}
      authConfig={{
        // TODO: update this for prod
        domain: "gamerly.app",
        authUrl: "/api/auth",
      }}
      queryClient={queryClient}
    >
      {children}
    </TWProvider>
  );
};
