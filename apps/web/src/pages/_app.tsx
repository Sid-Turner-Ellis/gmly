import "@/styles/globals.css";
import { QueryClientProvider } from "@/providers/query-provider";
import type { AppProps } from "next/app";
import { SiteLayout } from "@/components/site-layout/site-layout";
import { ThirdwebProvider } from "@/providers/thirdweb-provider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider>
      <QueryClientProvider>
        <SiteLayout>
          <Component {...pageProps} />
        </SiteLayout>
      </QueryClientProvider>
    </ThirdwebProvider>
  );
}
