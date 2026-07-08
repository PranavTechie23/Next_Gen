import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TPOApi } from "@/services/TPOApi";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface Applicant {
  id: number;
  student_id: number;
  roll_number: string;
  full_name: string;
  branch: string;
  status: string;
}

interface CompleteDriveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driveId: number | null;
  onSuccess: () => void;
}

export function CompleteDriveDialog({ open, onOpenChange, driveId, onSuccess }: CompleteDriveDialogProps) {
  const [loading, setLoading] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
  const [malesSelected, setMalesSelected] = useState<number>(0);
  const [femalesSelected, setFemalesSelected] = useState<number>(0);

  useEffect(() => {
    if (open && driveId) {
      // Reset state
      setSelectedStudents([]);
      setMalesSelected(0);
      setFemalesSelected(0);
      setLoading(true);

      TPOApi.getApplications({ drive: String(driveId), limit: 1000 })
        .then((res: any) => {
          setApplicants(res.applications || []);
        })
        .catch(() => {
          toast.error("Failed to load applicants for this drive");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, driveId]);

  const handleToggleStudent = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = async () => {
    if (!driveId) return;
    
    if (malesSelected + femalesSelected !== selectedStudents.length) {
       toast.error("Total males and females must match the number of selected students.");
       return;
    }

    setLoading(true);
    try {
      await TPOApi.updateDriveStatus(driveId, "COMPLETED", {
        selectedStudents,
        malesSelected,
        femalesSelected,
      });
      toast.success("Drive marked as completed successfully!");
      onSuccess();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to complete drive");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Complete Placement Drive</DialogTitle>
          <DialogDescription>
            Select the students who were placed, and provide demographic details for reporting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label>Select Placed Students ({selectedStudents.length} selected)</Label>
            <ScrollArea className="h-48 border rounded-md p-2 bg-slate-50 dark:bg-slate-900">
              {loading ? (
                <div className="p-4 text-center text-muted-foreground text-sm">Loading applicants...</div>
              ) : applicants.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">No applicants found for this drive.</div>
              ) : (
                <div className="space-y-2">
                  {applicants.map((app) => (
                    <div key={app.id} className="flex items-center space-x-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
                      <Checkbox 
                        id={`app-${app.id}`} 
                        checked={selectedStudents.includes(app.student_id)}
                        onCheckedChange={() => handleToggleStudent(app.student_id)}
                      />
                      <label 
                        htmlFor={`app-${app.id}`} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                      >
                        {app.full_name} ({app.roll_number}) - {app.branch}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Total Males Selected</Label>
              <Input 
                type="number" 
                min="0" 
                value={malesSelected} 
                onChange={(e) => setMalesSelected(parseInt(e.target.value) || 0)} 
              />
            </div>
            <div className="space-y-2">
              <Label>Total Females Selected</Label>
              <Input 
                type="number" 
                min="0" 
                value={femalesSelected} 
                onChange={(e) => setFemalesSelected(parseInt(e.target.value) || 0)} 
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Mark as Completed"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
