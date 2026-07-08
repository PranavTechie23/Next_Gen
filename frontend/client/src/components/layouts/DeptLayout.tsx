import { cn } from "@/lib/utils";

type DeptLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

/** Shell wrapper for department (TPO Head) dashboard routes. */
export function DeptLayout({ children, className }: DeptLayoutProps) {
  return (
    <div className={cn("min-h-dvh w-full min-w-0 overflow-x-hidden bg-background text-foreground", className)}>
      {children}
    </div>
  );
}
