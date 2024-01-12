import {
  ThirdwebProvider as TWProvider,
  ThirdwebProviderProps,
  metamaskWallet,
} from "@thirdweb-dev/react";
import { ReactNode } from "react";
import { queryClient } from "./query-provider";
import { Ethereum, Polygon, Localhost, Mumbai } from "@thirdweb-dev/chains";

/**
 * TODO: Explore this
 * - It allows us to change our chain but stay logged in
 * - It allows us to change our wallet but stay logged in. wrong - only when we switch to an account that isn't 'active'?
 */

// const configForEnv = (): ThirdwebProviderProps<any> => {
//   const env = process.env.NEXT_PUBLIC_APP_ENV;

//   switch (env) {
//     case "development":
//       return {
//         supportedChains: [Localhost],
//         activeChain: "localhost",
//       } as const;
//     case "staging":
//       return {
//         supportedChains: [Mumbai],
//         activeChain: "mumbai",
//       } as const;
//     default: {
//       throw new Error("invalid env");
//     }
//   }
// };

export const ThirdwebProvider = ({ children }: { children: ReactNode }) => {
  // const config = configForEnv();
  return (
    <TWProvider
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!}
      supportedWallets={[metamaskWallet()]}
      supportedChains={[Localhost]}
      activeChain={"localhost"}
      authConfig={{
        domain: "gamerly.app",
        authUrl: "/api/auth",
      }}
      queryClient={queryClient}
    >
      {children}
    </TWProvider>
  );
};
