import "@/styles/globals.css";
import { QueryClientProvider } from "@/providers/query-provider";
import type { AppProps } from "next/app";
import { SiteLayout } from "@/components/site-layout/site-layout";
import { ThirdwebProvider } from "@/providers/thirdweb-provider";
import { TokenProvider } from "@/providers/token-provider";
import React from "react";
import { ConditionallyWrap } from "@/components/conditionally-wrap";
import { RegistrationModal } from "@/components/registration-modal";
import { RegistrationModalProvider } from "@/providers/registration-modal-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastProvider } from "@/providers/toast-provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider>
      <TokenProvider>
        <QueryClientProvider>
          <ToastProvider>
            <ConditionallyWrap
              condition={!pageProps.hideSidebar}
              Wrapper={SiteLayout}
            >
              <ReactQueryDevtools />
              <RegistrationModalProvider>
                <Component {...pageProps} />
              </RegistrationModalProvider>
            </ConditionallyWrap>
          </ToastProvider>
        </QueryClientProvider>
      </TokenProvider>
    </ThirdwebProvider>
  );
}
