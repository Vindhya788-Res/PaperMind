"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

/** Composes all global client providers in one place for the root layout. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryProvider>
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
