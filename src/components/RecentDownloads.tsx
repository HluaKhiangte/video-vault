import { Clock, CheckCircle2 } from "lucide-react";

const recent = [
  {
    id: 1,
    title: "Lo-fi Hip Hop Mix - Beats to Study",
    platform: "YouTube",
    size: "38 MB",
    res: "Audio",
    time: "2 min ago",
    color: "#FF0000",
  },
  {
    id: 2,
    title: "Street Photography in Tokyo 🗼",
    platform: "Instagram",
    size: "24 MB",
    res: "1080p",
    time: "14 min ago",
    color: "#E1306C",
  },
  {
    id: 3,
    title: "How To Make Perfect Ramen at Home",
    platform: "TikTok",
    size: "18 MB",
    res: "720p",
    time: "1 hr ago",
    color: "#69C9D0",
  },
];

const RecentDownloads = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent Downloads</p>
        <button className="text-xs text-primary hover:opacity-80 transition-opacity">Clear all</button>
      </div>
      <div className="space-y-2">
        {recent.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-secondary border border-border hover:border-primary/30 transition-all cursor-default"
          >
            <div
              className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold text-background"
              style={{ backgroundColor: item.color }}
            >
              {item.platform[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{item.title}</p>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                <span>{item.res}</span>
                <span>·</span>
                <span>{item.size}</span>
                <span>·</span>
                <Clock className="w-3 h-3" />
                <span>{item.time}</span>
              </div>
            </div>
            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentDownloads;
