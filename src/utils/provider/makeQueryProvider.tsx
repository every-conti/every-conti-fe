import {
  defaultShouldDehydrateQuery,
  QueryClient,
  isServer,
} from "@tanstack/react-query";

const makeQueryProvider = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },

      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
};

let browserQueryClient: QueryClient | undefined;

export const getQueryClient = () => {
  if (isServer) {
    return makeQueryProvider();
  } else {
    if (!browserQueryClient) {
      browserQueryClient = makeQueryProvider();
    }
    return browserQueryClient;
  }
};
