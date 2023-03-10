import { QueryClient } from "@tanstack/react-query";

const reactQuery = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

export default reactQuery;
