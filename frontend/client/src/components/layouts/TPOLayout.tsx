import { cn } from "@/lib/utils";

type TPOLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

/** Shell wrapper for TPO dashboard routes. */
export function TPOLayout({ children, className }: TPOLayoutProps) {
  return (
    <div className={cn("min-h-dvh w-full min-w-0 overflow-x-hidden bg-background text-foreground", className)}>
      {children}
    </div>
  );
}
