import {
  ThirdwebProvider as TWProvider,
  metamaskWallet,
} from "@thirdweb-dev/react";
import { ReactNode } from "react";
import { queryClient } from "./query-provider";
import { Ethereum, Polygon, Localhost } from "@thirdweb-dev/chains";
/**
 * Client id: b3dd0019d6fdcac64dc73a5c7beed609
 * Secret key: Lwft7exX2qbEhOk4sW5_axCeMTPxcLOhEVw6O9byLqsDfKL37Ks7fX5c-WixIrLmv4POuOeO6hhvIo-U7Q4ZNA
 */

export const ThirdwebProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TWProvider
      activeChain="localhost"
      clientId="b3dd0019d6fdcac64dc73a5c7beed609"
      supportedWallets={[metamaskWallet()]}
      supportedChains={[Localhost]}
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
