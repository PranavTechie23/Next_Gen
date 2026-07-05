import { useBranding } from "@/contexts/BrandingContext";

interface AppShellFooterProps {
  className?: string;
}

/** Minimal footer for authenticated app shells (TPO, student, department). */
export default function AppShellFooter({ className = "" }: AppShellFooterProps) {
  const { config } = useBranding();
  const year = new Date().getFullYear();
  const appName = config.APP_NAME || "Campus Career";
  const institution = config.INSTITUTION_NAME?.trim();

  return (
    <footer
      className={`shrink-0 border-t border-border px-6 py-4 text-center text-xs text-muted-foreground ${className}`}
    >
      <p>
        © {year} {appName}
        {institution ? ` · ${institution}` : ""}. All rights reserved.
      </p>
    </footer>
  );
}
