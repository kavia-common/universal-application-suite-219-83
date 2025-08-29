"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const client = new QueryClient();

// PUBLIC_INTERFACE
export function Providers({ children }: { children: React.ReactNode }) {
  /** This is a public component that wraps app providers. */
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // In a real app, read user/system preference. Default to system.
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  return <QueryClientProvider client={client}>{mounted && children}</QueryClientProvider>;
}
