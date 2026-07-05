import { useEffect } from "react";
import { useLocation } from "wouter";

/** Redirect legacy standalone routes into dashboard tab URLs. */
export function DashboardTabRedirect({ dashboardPath, tab }: { dashboardPath: string; tab: string }) {
  const [, navigate] = useLocation();

  useEffect(() => {
    navigate(`${dashboardPath}?tab=${tab}`);
  }, [dashboardPath, tab, navigate]);

  return null;
}
