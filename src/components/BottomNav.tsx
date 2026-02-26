import { Home, MessageCircle, Download } from "lucide-react";
import { cn } from "@/lib/utils";

export type Tab = "home" | "status" | "downloads";

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
  downloadCount: number;
}

const TABS: { id: Tab; label: string; icon: typeof Home; accent?: string }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "status", label: "Status Saver", icon: MessageCircle, accent: "#25D366" },
  { id: "downloads", label: "Downloads", icon: Download },
];

const BottomNav = ({ active, onChange, downloadCount }: Props) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2 border-t border-border bg-background/90 backdrop-blur-xl">
      {TABS.map((tab) => {
        const isActive = active === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex flex-col items-center gap-1 flex-1 py-1.5 rounded-xl transition-all duration-200 relative",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {/* Active indicator */}
            {isActive && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-primary" />
            )}

            <div className="relative">
              <Icon
                className={cn("w-5 h-5 transition-all", isActive && "scale-110")}
                style={isActive && tab.accent ? { color: tab.accent } : {}}
              />
              {tab.id === "downloads" && downloadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold leading-none">
                  {downloadCount}
                </span>
              )}
            </div>

            <span
              className={cn(
                "text-xs font-medium transition-all",
                isActive ? "opacity-100 font-semibold" : "opacity-70"
              )}
              style={isActive && tab.accent ? { color: tab.accent } : {}}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
