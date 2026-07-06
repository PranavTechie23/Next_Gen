import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TPOApi } from "@/services/TPOApi";
import { queryKeys } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  APPLICATION_STATUS_OPTIONS,
  formatApplicationStatus,
  type PlacementApplication,
} from "@/pages/tpo/dashboard/placementsUtils";
import { Loader2 } from "lucide-react";

const UPDATABLE_STATUSES = APPLICATION_STATUS_OPTIONS.filter((o) => o.value !== "all");

type UpdateApplicationStatusDialogProps = {
  application: PlacementApplication | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UpdateApplicationStatusDialog({
  application,
  open,
  onOpenChange,
}: UpdateApplicationStatusDialogProps) {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState(application?.status ?? "APPLIED");
  const [currentRound, setCurrentRound] = useState(application?.current_round ?? "");

  const mutation = useMutation({
    mutationFn: () =>
      TPOApi.updateApplicationStatus(application!.id!, {
        status,
        current_round: currentRound.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success("Application status updated.");
      void queryClient.invalidateQueries({ queryKey: ["TPO", "applications"] });
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to update application status.");
    },
  });

  const handleOpenChange = (next: boolean) => {
    if (next && application) {
      setStatus(application.status ?? "APPLIED");
      setCurrentRound(application.current_round ?? "");
    }
    onOpenChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update pipeline status</DialogTitle>
          <DialogDescription>
            {application?.company_name} · {application?.job_title}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UPDATABLE_STATUSES.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Current round (optional)</Label>
            <Input
              value={currentRound}
              onChange={(e) => setCurrentRound(e.target.value)}
              placeholder="e.g. Technical Round 2, HR Round"
            />
          </div>

          {application?.status && status !== application.status && (
            <p className="text-sm text-muted-foreground">
              Moving from <strong>{formatApplicationStatus(application.status)}</strong> to{" "}
              <strong>{formatApplicationStatus(status)}</strong>. The student will be notified.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending || !application?.id}>
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save status"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
