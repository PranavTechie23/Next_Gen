import { cn } from "@/lib/utils";

type StudentLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

/** Shell wrapper for student dashboard routes. */
export function StudentLayout({ children, className }: StudentLayoutProps) {
  return (
    <div className={cn("min-h-dvh w-full min-w-0 overflow-x-hidden bg-background text-foreground", className)}>
      {children}
    </div>
  );
}
