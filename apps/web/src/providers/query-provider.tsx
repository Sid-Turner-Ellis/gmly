import { PropsWithChildren } from "react";
import {
  QueryClient,
  QueryClientProvider as QCProvider,
  QueryCache,
} from "react-query";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => console.log(error),
  }),
});

export const QueryClientProvider = (props: PropsWithChildren) => {
  return <QCProvider client={queryClient}>{props.children}</QCProvider>;
};
