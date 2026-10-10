"use client";

import { QueryClient, QueryClientProvider, useQuery, type UseQueryResult } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { gate, getDatabase, hydrateDatabase, subscribeDatabase } from "@/services/database";
import type { Database } from "@/mocks/types";
import { useUiStore } from "@/stores/ui-store";

function makeClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false, staleTime: Infinity } },
  });
}

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(makeClient);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrateDatabase();
    void useUiStore.persist.rehydrate();
    const unsubscribe = subscribeDatabase(() => {
      client.setQueryData(["database"], structuredClone(getDatabase()));
    });
    setReady(true);
    return unsubscribe;
  }, [client]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Opening the demo…</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={client}>
      {children}
      <Toaster position="top-center" richColors closeButton />
    </QueryClientProvider>
  );
}

export function useDatabase(): UseQueryResult<Database> {
  return useQuery({
    queryKey: ["database"],
    queryFn: async () => {
      await gate(180);
      return structuredClone(getDatabase());
    },
  });
}
