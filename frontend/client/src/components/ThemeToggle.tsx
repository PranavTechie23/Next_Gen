import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  if (!toggleTheme) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={`relative h-9 w-9 rounded-md border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 ${className || ""}`}
            aria-label="Toggle theme"
          >
            <Sun className="h-[50%] w-[50%] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[50%] w-[50%] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" sideOffset={8} className="bg-[#242424] text-[#E4E4E7] border border-[#3f3f46] px-3 py-1.5 text-xs rounded-md shadow-xl dark:bg-[#18181b] dark:border-[#27272a]">
          <p>Switch Theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}








