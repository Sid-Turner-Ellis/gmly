import { ThirdwebProvider as TWProvider } from "@thirdweb-dev/react";
import { ReactNode } from "react";

export const ThirdwebProvider = ({ children }: { children: ReactNode }) => {
  return (
    <TWProvider
      activeChain="goerli"
      clientId="dd889be01a6b364576a50984107b357d"
      authConfig={{
        // TODO: update this for prod
        domain: "gamerly.app",
        authUrl: "/api/auth",
      }}
    >
      {children}
    </TWProvider>
  );
};

// Secret key - 4Byuxr8BX3UVx01Kgz18prCSDvl89DXzJtXXNV6y9BlunGS16KRAnRYlGaBcqfNmffGKBqtraa4RlANNrrlzgw
