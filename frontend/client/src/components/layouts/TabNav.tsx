import { cn } from "@/lib/utils";

type TabNavItem = {
  id: string;
  label: string;
};

type TabNavProps = {
  tabs: readonly string[] | TabNavItem[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
  mobileHidden?: boolean;
};

export function TabNav({ tabs, activeTab, onTabChange, className, mobileHidden = false }: TabNavProps) {
  return (
    <div className={cn(`${mobileHidden ? "hidden sm:flex" : "flex"} gap-1 overflow-x-auto`, className)}>
      {tabs.map((tab) => {
        const id = typeof tab === "string" ? tab : tab.id;
        const label = typeof tab === "string" ? tab : tab.label;
        const isActive = activeTab === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            className={cn(
              "relative whitespace-nowrap px-4 py-3 text-sm font-bold capitalize transition-all duration-200",
              isActive 
                ? "text-primary font-black" 
                : "text-muted-foreground hover:bg-muted/30 hover:text-foreground"
            )}
          >
            {label}
            {isActive && <span className="absolute inset-x-0 bottom-0 h-[3px] rounded-t-full bg-primary" />}
          </button>
        );
      })}
    </div>
  );
}
