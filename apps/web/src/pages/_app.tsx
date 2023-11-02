import "@/styles/globals.css";
import { QueryClientProvider } from "@/providers/query-provider";
import type { AppProps } from "next/app";
import { Sidebar } from "@/components/sidebar/sidebar";
import { SiteLayout } from "@/components/site-layout";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider>
      <SiteLayout>
        <Component {...pageProps} />
      </SiteLayout>
    </QueryClientProvider>
  );
}
