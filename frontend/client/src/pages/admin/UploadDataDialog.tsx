import { useRef, useState, type RefObject, type ReactNode } from "react";
import { toast } from "sonner";
import { Building2, Loader2, Upload, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { deptApi } from "@/services/deptApi";

type UploadDataDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const isExcelFile = (file: File) =>
  /\.(xlsx|xls)$/i.test(file.name) ||
  file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
  file.type === "application/vnd.ms-excel";

type UploadRowProps = {
  icon: ReactNode;
  title: string;
  description: string;
  accentClass: string;
  uploading: boolean;
  dragOver: boolean;
  onDragOverChange: (over: boolean) => void;
  onFile: (file?: File) => void;
  inputRef: RefObject<HTMLInputElement | null>;
};

function UploadRow({
  icon,
  title,
  description,
  accentClass,
  uploading,
  dragOver,
  onDragOverChange,
  onFile,
  inputRef,
}: UploadRowProps) {
  const pickFile = () => {
    if (!uploading) inputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "relative flex gap-3.5 rounded-lg border border-border/70 bg-card px-3.5 py-3.5 transition-colors",
        "border-l-[2px]",
        accentClass,
        dragOver && "border-border bg-muted/40 ring-1 ring-ring/25",
        uploading && "pointer-events-none opacity-70"
      )}
      onDragEnter={(e) => {
        e.preventDefault();
        onDragOverChange(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => onDragOverChange(false)}
      onDrop={(e) => {
        e.preventDefault();
        onDragOverChange(false);
        const f = e.dataTransfer.files?.[0];
        if (!f) return;
        if (!isExcelFile(f)) {
          toast.error("Please upload an Excel file (.xlsx or .xls).");
          return;
        }
        void onFile(f);
      }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted/60 text-muted-foreground [&_svg]:h-4 [&_svg]:w-4"
        aria-hidden
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug text-foreground">{title}</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{description}</p>
        <p className="mt-2 text-[11px] text-muted-foreground/80">
          Drop .xlsx or .xls —{" "}
          <button
            type="button"
            className="font-medium text-foreground underline-offset-2 hover:underline disabled:opacity-50"
            disabled={uploading}
            onClick={pickFile}
          >
            browse
          </button>
        </p>
      </div>

      <div className="flex shrink-0 items-center self-center">
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-label="Uploading" />
        ) : null}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          void onFile(f);
        }}
      />
    </div>
  );
}

export default function UploadDataDialog({ open, onOpenChange }: UploadDataDialogProps) {
  const [uploadingStudents, setUploadingStudents] = useState(false);
  const [uploadingCompanyStats, setUploadingCompanyStats] = useState(false);
  const [dragOverStudents, setDragOverStudents] = useState(false);
  const [dragOverCompany, setDragOverCompany] = useState(false);
  const studentsFileRef = useRef<HTMLInputElement>(null);
  const companyStatsFileRef = useRef<HTMLInputElement>(null);

  const onUploadStudentsExcel = async (file?: File) => {
    if (!file) return;
    try {
      setUploadingStudents(true);
      await deptApi.uploadStudentsExcel(file);
      toast.success("Students data uploaded.");
    } catch (e) {
      console.error("uploadStudentsExcel failed", e);
      toast.error("Failed to upload students data.");
    } finally {
      setUploadingStudents(false);
    }
  };

  const onUploadCompanyStatsExcel = async (file?: File) => {
    if (!file) return;
    try {
      setUploadingCompanyStats(true);
      await deptApi.uploadCompanyStatsExcel(file);
      toast.success("Company stats uploaded.");
    } catch (e) {
      console.error("uploadCompanyStatsExcel failed", e);
      toast.error("Failed to upload company stats.");
    } finally {
      setUploadingCompanyStats(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 overflow-hidden rounded-xl border-border/60 p-0 shadow-lg sm:max-w-lg">
        <DialogHeader className="space-y-3 px-5 pb-1 pt-5 sm:px-6 sm:pt-6">
          <div className="flex items-center gap-2.5 pr-8">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/60 bg-muted/50 text-muted-foreground">
              <Upload className="h-4 w-4" />
            </div>
            <DialogTitle className="text-base font-semibold tracking-tight">
              Upload data
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs leading-relaxed text-muted-foreground">
            Import student academics or company hiring statistics from Excel (.xlsx, .xls).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2.5 px-5 py-4 sm:px-6">
          <UploadRow
            icon={<Users />}
            title="Students data"
            description="CGPA, backlogs, semester marks, and eligibility fields."
            accentClass="border-l-primary/50"
            uploading={uploadingStudents}
            dragOver={dragOverStudents}
            onDragOverChange={setDragOverStudents}
            onFile={onUploadStudentsExcel}
            inputRef={studentsFileRef}
          />
          <UploadRow
            icon={<Building2 />}
            title="Company stats"
            description="Placements by year, roles offered, and CTC distribution."
            accentClass="border-l-border"
            uploading={uploadingCompanyStats}
            dragOver={dragOverCompany}
            onDragOverChange={setDragOverCompany}
            onFile={onUploadCompanyStatsExcel}
            inputRef={companyStatsFileRef}
          />
        </div>

        <DialogFooter className="flex-row items-center justify-between gap-3 border-t border-border/50 px-5 py-3.5 sm:px-6">
          <p className="text-[11px] leading-snug text-muted-foreground">
            Use official template columns for best results.
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 shrink-0 px-3 text-xs text-muted-foreground"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
