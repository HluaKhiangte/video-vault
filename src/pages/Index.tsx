import { useState } from "react";
import UrlInputBar from "@/components/UrlInputBar";
import PlatformButtons from "@/components/PlatformButtons";
import DownloadProgress from "@/components/DownloadProgress";
import VideoPreview from "@/components/VideoPreview";
import RecentDownloads from "@/components/RecentDownloads";
import { Download } from "lucide-react";

export type DownloadState = "idle" | "fetching" | "downloading" | "done" | "error";

export interface VideoInfo {
  title: string;
  thumbnail: string;
  duration: string;
  platform: string;
  resolution: string;
  fileSize: string;
}

const MOCK_VIDEO: VideoInfo = {
  title: "Amazing Sunset Timelapse - 4K Ultra HD",
  thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&q=80",
  duration: "3:42",
  platform: "YouTube",
  resolution: "1080p",
  fileSize: "142 MB",
};

const Index = () => {
  const [url, setUrl] = useState("");
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");
  const [progress, setProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

  const handleFetch = () => {
    if (!url.trim()) return;
    setDownloadState("fetching");
    setProgress(0);
    setVideoInfo(null);

    setTimeout(() => {
      setVideoInfo(MOCK_VIDEO);
      setDownloadState("idle");
    }, 1800);
  };

  const handleDownload = () => {
    setDownloadState("downloading");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setDownloadState("done");
          return 100;
        }
        return p + Math.random() * 8 + 2;
      });
    }, 180);
  };

  const handleReset = () => {
    setUrl("");
    setDownloadState("idle");
    setProgress(0);
    setVideoInfo(null);
    setActivePlatform(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse, hsl(195 100% 50%), transparent 70%)" }} />
        <div className="absolute bottom-[10%] right-[-5%] w-[300px] h-[300px] rounded-full opacity-8"
          style={{ background: "radial-gradient(ellipse, hsl(265 80% 65%), transparent 70%)" }} />
      </div>

      <div className="relative z-10 container max-w-xl mx-auto px-4 pt-10 pb-20">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border mb-4">
            <Download className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase">Video Downloader</span>
          </div>
          <h1 className="font-display text-3xl font-bold mb-2">
            <span className="gradient-text">Download</span> Any Video
          </h1>
          <p className="text-muted-foreground text-sm">
            Paste a link from YouTube, Instagram, Facebook & more
          </p>
        </header>

        {/* Platform Buttons */}
        <PlatformButtons
          activePlatform={activePlatform}
          onSelect={setActivePlatform}
          onUrlSet={setUrl}
        />

        {/* URL Input */}
        <UrlInputBar
          url={url}
          setUrl={setUrl}
          onFetch={handleFetch}
          isLoading={downloadState === "fetching"}
        />

        {/* Video Preview */}
        {videoInfo && (
          <VideoPreview
            info={videoInfo}
            downloadState={downloadState}
            onDownload={handleDownload}
            onReset={handleReset}
          />
        )}

        {/* Download Progress */}
        {(downloadState === "downloading" || downloadState === "done") && (
          <DownloadProgress progress={Math.min(progress, 100)} state={downloadState} />
        )}

        {/* Recent Downloads */}
        <RecentDownloads />
      </div>
    </div>
  );
};

export default Index;
