"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

type Props = {
  intervalMs?: number;
};

export default function AutoRefresh({ intervalMs = 60_000 }: Props) {
  const router = useRouter();
  const lastRefreshAt = useRef(Date.now());

  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      lastRefreshAt.current = Date.now();
      router.refresh();
    };

    const timer = window.setInterval(refresh, intervalMs);

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastRefreshAt.current >= intervalMs
      ) {
        refresh();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [intervalMs, router]);

  return null;
}
