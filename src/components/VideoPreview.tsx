import { Play, Download, RotateCcw, Clock, Monitor, HardDrive, Music, Film, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoInfo, DownloadState } from "@/pages/Index";
import { useState, useMemo } from "react";

interface Props {
  info: VideoInfo;
  downloadState: DownloadState;
  onDownload: (selectedRes?: string) => void;
  onReset: () => void;
  medias?: any[];
}

const DEFAULT_RESOLUTIONS = ["4K", "1080p", "720p", "480p", "360p", "Audio only"];

type Format = "MP4" | "MP3" | "WEBM";

const FORMAT_OPTIONS: { id: Format; label: string; icon: React.ElementType; ext: string }[] = [
  { id: "MP4",  label: "MP4",  icon: Film,  ext: "mp4"  },
  { id: "MP3",  label: "MP3",  icon: Music, ext: "mp3"  },
  { id: "WEBM", label: "WEBM", icon: Video, ext: "webm" },
];

const VideoPreview = ({ info, downloadState, onDownload, onReset, medias = [] }: Props) => {
  const [selectedFormat, setSelectedFormat] = useState<Format>("MP4");

  // Detect if a media entry is audio-only
  // A true audio-only stream has NO video dimensions (width/height).
  // YouTube combined streams (mp4 360p) have is_audio:true but still have width+height — exclude those.
  const isAudioOnly = (m: any) => {
    const hasVideo = m.width && m.height && m.width > 0 && m.height > 0;
    if (hasVideo) return false; // combined audio+video — not audio-only
    const mimeType = (m.mimeType || m.mime_type || "").toLowerCase();
    const ext = (m.ext || m.extension || "").toLowerCase();
    return (
      m.type === "audio" ||
      mimeType.startsWith("audio") ||
      ext === "mp3" || ext === "m4a" || ext === "aac" ||
      (m.audioQuality != null && m.audioSampleRate != null)
    );
  };

  // Label for an audio-only stream — show bitrate or quality tier
  const audioLabel = (m: any) => {
    const rate = m.audioSampleRate ? `${Math.round(parseInt(m.audioSampleRate) / 1000)}kHz` : "";
    const tier = (m.audioQuality || "").replace("AUDIO_QUALITY_", "");
    return [tier, rate].filter(Boolean).join(" ") || m.quality || "Audio";
  };

  // Filter medias by selected format
  const filteredMedias = useMemo(() => {
    if (medias.length === 0) return [];
    return medias.filter((m: any) => {
      const ext = (m.ext || m.extension || "").toLowerCase();
      const mimeType = (m.mimeType || m.mime_type || "").toLowerCase();
      if (selectedFormat === "MP3") return isAudioOnly(m);
      if (selectedFormat === "WEBM") return (ext === "webm" || mimeType.includes("webm")) && !isAudioOnly(m);
      // MP4 — video mp4 only, exclude audio-only and webm
      return (ext === "mp4" || mimeType.includes("video/mp4")) && !isAudioOnly(m);
    });
  }, [medias, selectedFormat]);

  const displayMedias = filteredMedias.length > 0 ? filteredMedias : medias;

  const resolutionOptions = displayMedias.length > 0
    ? displayMedias.map((m: any) =>
        isAudioOnly(m) ? audioLabel(m) : (m.quality || m.resolution || "Best")
      ).filter(Boolean)
    : DEFAULT_RESOLUTIONS;

  const [selectedRes, setSelectedRes] = useState(resolutionOptions[0] || "Best");

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

        {/* Format toggle */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Format</p>
          <div className="flex gap-2 p-1 rounded-xl bg-muted border border-border">
            {FORMAT_OPTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setSelectedFormat(id); setSelectedRes(resolutionOptions[0] || "Best"); }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedFormat === id
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Resolution selector */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-2 font-medium">Quality</p>
          <div className="flex flex-wrap gap-1.5">
            {resolutionOptions.map((res) => (
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
              onClick={() => onDownload(selectedRes)}
              disabled={isDownloading}
              className="flex-1 bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 animate-pulse-glow"
            >
              <Download className="w-4 h-4 mr-2" />
              {isDownloading ? "Downloading..." : `Download ${selectedFormat} · ${selectedRes}`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
export default VideoPreview;
