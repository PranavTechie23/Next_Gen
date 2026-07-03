import { useEffect, useRef } from "react";
import { DASHBOARD_SYNC_MS } from "@/lib/dashboardCache";

/**
 * Run callback every `intervalMs` (default 2 min).
 * Uses a ref so the latest callback is always invoked without resetting the interval.
 * @param skipInitialRun When true, only the interval fires (use with a separate mount fetch).
 */
export function useBackgroundSync(
  callback: () => void | Promise<void>,
  enabled = true,
  intervalMs = DASHBOARD_SYNC_MS,
  skipInitialRun = false
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (!enabled) return;

    const run = () => void callbackRef.current();

    if (!skipInitialRun) {
      run();
    }
    const intervalId = window.setInterval(run, intervalMs);
    return () => window.clearInterval(intervalId);
  }, [enabled, intervalMs, skipInitialRun]);
}
