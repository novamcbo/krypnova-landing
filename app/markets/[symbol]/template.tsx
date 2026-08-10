"use client";

import type { ReactNode } from "react";
import AutoRefresh from "./AutoRefresh";

export default function SymbolTemplate({ children }: { children: ReactNode }) {
  return (
    <>
      <AutoRefresh intervalMs={60_000} />
      {children}
    </>
  );
}
