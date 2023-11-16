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
import { ErrorBoundary } from "@/components/error-boundary";
import { Inter, Bricolage_Grotesque } from "@next/font/google";
import { cn } from "@/utils/cn";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const grotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-grotesque",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={cn("w-full h-full", inter.variable, grotesque.variable)}>
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
                  <ErrorBoundary>
                    <Component {...pageProps} />
                  </ErrorBoundary>
                </RegistrationModalProvider>
              </ConditionallyWrap>
            </ToastProvider>
          </QueryClientProvider>
        </TokenProvider>
      </ThirdwebProvider>
    </div>
  );
}
