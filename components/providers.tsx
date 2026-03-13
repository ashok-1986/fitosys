"use client";

import { ToastProvider } from "@/hooks/use-toast";
import QueryProvider from "@/lib/query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ToastProvider>{children}</ToastProvider>
    </QueryProvider>
  );
}
