import { useState } from "react";
import { Play, Share2, Trash2, Download, Film, Music, CheckCircle2 } from "lucide-react";

interface DownloadedFile {
  id: number;
  title: string;
  platform: string;
  platformColor: string;
  size: string;
  resolution: string;
  thumbnail: string;
  type: "video" | "audio";
  date: string;
}

const DownloadsTab = () => {
  const [files, setFiles] = useState<DownloadedFile[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setDeletingId(id);
    setTimeout(() => {
      setFiles((prev) => prev.filter((f) => f.id !== id));
      setDeletingId(null);
    }, 300);
  };

  const totalSize = files.reduce((acc, f) => acc + parseFloat(f.size), 0).toFixed(0);

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header stats */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="font-display font-bold text-base text-foreground">My Downloads</h2>
          <p className="text-xs text-muted-foreground">{files.length} files · {totalSize} MB used</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success/10 border border-success/20">
          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
          <span className="text-xs text-success font-semibold">All saved</span>
        </div>
      </div>

      {files.length === 0 ? (
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
          {files.map((file) => (
            <div
              key={file.id}
              className={`flex items-center gap-3 p-3 rounded-2xl bg-card border border-border transition-all duration-300 ${
                deletingId === file.id ? "opacity-0 scale-95" : "opacity-100"
              }`}
            >
              {/* Thumbnail */}
              <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-secondary">
                <img src={file.thumbnail} alt={file.title} className="w-full h-full object-cover" />
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
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: file.platformColor + "22", color: file.platformColor }}
                  >
                    {file.platform}
                  </span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{file.resolution}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{file.size}</span>
                </div>
                <p className="text-xs text-muted-foreground/60 mt-0.5">{file.date}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1.5 shrink-0">
                <button className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all active:scale-90">
                  <Play className="w-3.5 h-3.5 ml-0.5" fill="currentColor" />
                </button>
                <button className="w-8 h-8 rounded-xl bg-secondary text-muted-foreground flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all active:scale-90">
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
          ))}
        </div>
      )}
    </div>
  );
};

export default DownloadsTab;
