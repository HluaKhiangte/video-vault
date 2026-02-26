import { CheckCircle2, Download } from "lucide-react";
import { DownloadState } from "@/pages/Index";

interface Props {
  progress: number;
  state: DownloadState;
}

const DownloadProgress = ({ progress, state }: Props) => {
  const isDone = state === "done";
  const displayProgress = Math.min(Math.round(progress), 100);

  return (
    <div className="mb-5 p-4 rounded-2xl border border-border bg-card shadow-card animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isDone ? (
            <CheckCircle2 className="w-4 h-4 text-success" />
          ) : (
            <Download className="w-4 h-4 text-primary animate-bounce" />
          )}
          <span className="text-sm font-semibold text-foreground">
            {isDone ? "Download Complete!" : "Downloading..."}
          </span>
        </div>
        <span className="text-sm font-mono font-bold text-primary">{displayProgress}%</span>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{
            width: `${displayProgress}%`,
            background: isDone
              ? "hsl(var(--success))"
              : "var(--gradient-primary)",
          }}
        />
      </div>

      {!isDone && (
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Amazing Sunset Timelapse...</span>
          <span>{Math.round((displayProgress / 100) * 142)} / 142 MB</span>
        </div>
      )}

      {isDone && (
        <p className="mt-2 text-xs text-success">
          Saved to your Downloads folder ✓
        </p>
      )}
    </div>
  );
};

export default DownloadProgress;
