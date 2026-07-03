import { useCallback, useEffect, useState } from "react";
import { MANUAL_REFRESH_COOLDOWN_MS } from "@/lib/queryClient";

export function useManualRefresh(onRefresh: () => void | Promise<void>) {
  const [lastManualRefreshAt, setLastManualRefreshAt] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tick, setTick] = useState(0);

  const cooldownRemainingMs = lastManualRefreshAt
    ? Math.max(0, MANUAL_REFRESH_COOLDOWN_MS - (Date.now() - lastManualRefreshAt))
    : 0;

  const canRefresh = cooldownRemainingMs <= 0 && !isRefreshing;

  useEffect(() => {
    if (!lastManualRefreshAt || cooldownRemainingMs <= 0) return;
    const timer = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [lastManualRefreshAt, cooldownRemainingMs]);

  void tick;

  const label = isRefreshing
    ? "Refreshing…"
    : cooldownRemainingMs > 0
      ? `Refresh in ${Math.ceil(cooldownRemainingMs / 60000)}m`
      : "Refresh data";

  const refresh = useCallback(async () => {
    if (!canRefresh) return;
    setLastManualRefreshAt(Date.now());
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [canRefresh, onRefresh]);

  return {
    canRefresh,
    isRefreshing,
    refresh,
    label,
    cooldownMinutes: MANUAL_REFRESH_COOLDOWN_MS / 60000,
  };
}
