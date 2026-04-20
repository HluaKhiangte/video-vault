import { useState } from "react";
import { Share2, Trash2, Download, Film, Music, CheckCircle2, ExternalLink } from "lucide-react";
import { useDownloadHistory, formatRelativeDate } from "@/hooks/use-download-history";

const PLATFORM_COLORS: Record<string, string> = {
  YouTube: "#FF0000",
  Youtube: "#FF0000",
  Instagram: "#E1306C",
  Facebook: "#1877F2",
  Twitter: "#1DA1F2",
  TikTok: "#010101",
};

const DownloadsTab = () => {
  const { history, removeItem, clearAll } = useDownloadHistory();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      removeItem(id);
      setDeletingId(null);
    }, 250);
  };

  const totalSizeMB = history.reduce((acc, f) => {
    const num = parseFloat(f.size);
    return acc + (isNaN(num) ? 0 : num);
  }, 0).toFixed(0);

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header stats */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="font-display font-bold text-base text-foreground">My Downloads</h2>
          <p className="text-xs text-muted-foreground">
            {history.length} {history.length === 1 ? "file" : "files"} · {totalSizeMB} MB total
          </p>
        </div>
        {history.length > 0 ? (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold hover:bg-destructive/20 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success/10 border border-success/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            <span className="text-xs text-success font-semibold">Empty</span>
          </div>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
            <Download className="w-7 h-7 text-muted-foreground" />
          </div>
          <div>
            <p className="font-display font-semibold text-foreground mb-1">No downloads yet</p>
            <p className="text-xs text-muted-foreground">Videos you download will appear here</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {history.map((file) => {
            const platformColor = PLATFORM_COLORS[file.platform] || "#888";
            return (
              <div
                key={file.id}
                className={`flex items-center gap-3 p-3 rounded-2xl bg-card border border-border transition-all duration-300 ${
                  deletingId === file.id ? "opacity-0 scale-95" : "opacity-100"
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-secondary">
                  {file.thumbnail ? (
                    <img
                      src={file.thumbnail}
                      alt={file.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center bg-background/30">
                    {file.type === "audio" ? (
                      <Music className="w-4 h-4 text-foreground" />
                    ) : (
                      <Film className="w-4 h-4 text-foreground" />
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-1">{file.title}</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className="text-xs font-bold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: platformColor + "22", color: platformColor }}
                    >
                      {file.platform}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground font-semibold">{file.format}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{file.resolution}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{file.size}</span>
                  </div>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">{formatRelativeDate(file.date)}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  {file.sourceUrl && (
                    <a
                      href={file.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all active:scale-90"
                      title="Open source"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => {
                      if (navigator.share && file.sourceUrl) {
                        navigator.share({ title: file.title, url: file.sourceUrl }).catch(() => {});
                      } else if (file.sourceUrl) {
                        navigator.clipboard.writeText(file.sourceUrl);
                      }
                    }}
                    className="w-8 h-8 rounded-xl bg-secondary text-muted-foreground flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all active:scale-90"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="w-8 h-8 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-all active:scale-90"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DownloadsTab;
