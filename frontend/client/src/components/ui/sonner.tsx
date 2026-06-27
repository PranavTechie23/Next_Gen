import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { CheckCircle2 } from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      icons={{
        success: (
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/95 text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
          </span>
        ),
      }}
      toastOptions={{
        classNames: {
          success:
            "!bg-emerald-600 !text-white !border !border-emerald-500 shadow-lg shadow-emerald-900/30",
          error:
            "!bg-destructive !text-destructive-foreground !border !border-destructive/50 shadow-lg shadow-destructive/20",
          title: "!font-bold",
          description: "!opacity-90",
        },
      }}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
