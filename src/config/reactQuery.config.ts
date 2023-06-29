import { QueryClient } from "@tanstack/react-query";

const reactQueryConfig = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});

export default reactQueryConfig;
