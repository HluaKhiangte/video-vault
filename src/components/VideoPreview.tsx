import { Play, Download, RotateCcw, Clock, Monitor, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoInfo, DownloadState } from "@/pages/Index";
import { useState } from "react";

interface Props {
  info: VideoInfo;
  downloadState: DownloadState;
  onDownload: () => void;
  onReset: () => void;
}

const resolutions = ["4K", "1080p", "720p", "480p", "360p", "Audio only"];

const VideoPreview = ({ info, downloadState, onDownload, onReset }: Props) => {
  const [selectedRes, setSelectedRes] = useState("1080p");

  const isDone = downloadState === "done";
  const isDownloading = downloadState === "downloading";

  return (
    <div className="mb-5 rounded-2xl border border-border bg-card shadow-card overflow-hidden animate-fade-in">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        <img
          src={info.thumbnail}
          alt={info.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/30 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center border border-border">
            <Play className="w-5 h-5 text-foreground ml-0.5" fill="currentColor" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-background/80 text-xs font-mono text-foreground">
          {info.duration}
        </div>
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold"
          style={{ backgroundColor: "#FF0000", color: "#fff" }}>
          {info.platform}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-sm text-foreground leading-snug mb-3 line-clamp-2">
          {info.title}
        </h3>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{info.duration}</span>
          <span className="flex items-center gap-1.5"><Monitor className="w-3.5 h-3.5" />{selectedRes}</span>
          <span className="flex items-center gap-1.5"><HardDrive className="w-3.5 h-3.5" />{info.fileSize}</span>
        </div>

        {/* Resolution selector */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Quality</p>
          <div className="flex flex-wrap gap-1.5">
            {resolutions.map((res) => (
              <button
                key={res}
                onClick={() => setSelectedRes(res)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  selectedRes === res
                    ? "bg-primary text-primary-foreground border-primary shadow-glow"
                    : "bg-secondary text-secondary-foreground border-border hover:border-primary/40"
                }`}
              >
                {res}
              </button>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          {isDone ? (
            <Button
              onClick={onReset}
              variant="outline"
              className="flex-1 border-success text-success hover:bg-success hover:text-success-foreground transition-all"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Download Another
            </Button>
          ) : (
            <Button
              onClick={onDownload}
              disabled={isDownloading}
              className="flex-1 bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 animate-pulse-glow"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? "Downloading..." : `Download ${selectedRes}`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
