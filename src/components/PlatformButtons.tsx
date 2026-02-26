import { cn } from "@/lib/utils";

interface Platform {
  id: string;
  label: string;
  color: string;
  icon: string;
  placeholder: string;
}

const platforms: Platform[] = [
  {
    id: "youtube",
    label: "YouTube",
    color: "#FF0000",
    icon: "▶",
    placeholder: "https://youtube.com/watch?v=...",
  },
  {
    id: "instagram",
    label: "Instagram",
    color: "#E1306C",
    icon: "◈",
    placeholder: "https://instagram.com/p/...",
  },
  {
    id: "facebook",
    label: "Facebook",
    color: "#1877F2",
    icon: "f",
    placeholder: "https://facebook.com/watch?v=...",
  },
  {
    id: "tiktok",
    label: "TikTok",
    color: "#69C9D0",
    icon: "♪",
    placeholder: "https://tiktok.com/@user/video/...",
  },
  {
    id: "twitter",
    label: "X / Twitter",
    color: "#94A3B8",
    icon: "✕",
    placeholder: "https://x.com/i/status/...",
  },
];

interface Props {
  activePlatform: string | null;
  onSelect: (id: string | null) => void;
  onUrlSet: (url: string) => void;
}

const PlatformButtons = ({ activePlatform, onSelect, onUrlSet }: Props) => {
  const handleClick = (p: Platform) => {
    if (activePlatform === p.id) {
      onSelect(null);
      onUrlSet("");
    } else {
      onSelect(p.id);
      onUrlSet(p.placeholder);
    }
  };

  return (
    <div className="mb-4">
      <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">Quick Select</p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {platforms.map((p) => {
          const isActive = activePlatform === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handleClick(p)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 border shrink-0",
                isActive
                  ? "border-transparent text-background scale-95"
                  : "border-border bg-secondary text-secondary-foreground hover:border-border hover:bg-muted"
              )}
              style={
                isActive
                  ? { backgroundColor: p.color, borderColor: p.color }
                  : {}
              }
            >
              <span className="text-sm leading-none">{p.icon}</span>
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PlatformButtons;
