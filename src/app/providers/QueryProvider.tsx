import { QueryClientProvider } from "@tanstack/react-query";
import { lazy, type PropsWithChildren, Suspense } from "react";

import { queryClient } from "@/shared/lib/query-client";

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(async () => {
      const { ReactQueryDevtools } = await import("@tanstack/react-query-devtools");

      return { default: ReactQueryDevtools };
    })
  : null;

export function QueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {ReactQueryDevtools ? (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      ) : null}
    </QueryClientProvider>
  );
}
