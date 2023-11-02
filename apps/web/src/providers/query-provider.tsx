import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider as QCProvider } from "react-query";

const queryClient = new QueryClient();

export const QueryClientProvider = (props: PropsWithChildren) => {
  return <QCProvider client={queryClient}>{props.children}</QCProvider>;
};
