import { PropsWithChildren } from "react";
import {
  QueryClient,
  QueryClientProvider as QCProvider,
  QueryCache,
} from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {},
  queryCache: new QueryCache({
    onError: (error) => console.log(error),
  }),
});

export const QueryClientProvider = (props: PropsWithChildren) => {
  return <QCProvider client={queryClient}>{props.children}</QCProvider>;
};
