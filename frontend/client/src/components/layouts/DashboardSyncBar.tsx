import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DashboardSyncBarProps = {
  lastSyncedAt?: number | null;
  isSyncing?: boolean;
  canRefresh: boolean;
  refreshLabel: string;
  onRefresh: () => void;
  cooldownMinutes?: number;
  showText?: boolean;
  className?: string;
};

export function DashboardSyncBar({
  lastSyncedAt,
  isSyncing = false,
  canRefresh,
  refreshLabel,
  onRefresh,
  cooldownMinutes = 15,
  showText = false,
  className,
}: DashboardSyncBarProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showText && (
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          {isSyncing ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Syncing latest data…
            </>
          ) : lastSyncedAt ? (
            <>
              Last synced {new Date(lastSyncedAt).toLocaleTimeString()} · manual refresh every {cooldownMinutes} min
            </>
          ) : null}
        </p>
      )}
      <Button variant="outline" size="sm" className="font-semibold gap-2 border-border hover:bg-muted/50" disabled={!canRefresh} onClick={onRefresh}>
        <RefreshCw className={cn("h-4 w-4 text-muted-foreground", isSyncing && "animate-spin")} />
        {refreshLabel}
      </Button>
    </div>
  );
}
