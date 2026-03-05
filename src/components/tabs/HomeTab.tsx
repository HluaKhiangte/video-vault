import { useState, useRef } from "react";
import { Clipboard, Download, Link2, X, Heart, Play, TrendingUp, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoPreview from "@/components/VideoPreview";
import DownloadProgress from "@/components/DownloadProgress";
import { DownloadState, VideoInfo } from "@/pages/Index";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import ShareSheet from "@/components/ShareSheet";

// Helper to pick the best media URL from the API response
function extractDownloadInfo(data: any): { title: string; thumbnail: string; duration: string; platform: string; medias: any[] } | null {
  if (!data) return null;
  return {
    title: data.title || data.fulltitle || "Video",
    thumbnail: data.thumbnail || data.thumbnails?.[0]?.url || "",
    duration: data.duration_string || (data.duration ? `${Math.floor(data.duration / 60)}:${String(data.duration % 60).padStart(2, '0')}` : ""),
    platform: data.extractor_key || data.extractor || "Video",
    medias: data.medias || [],
  };
}

const PLATFORMS = [
  { id: "youtube", label: "YouTube", color: "#FF0000", abbr: "YT", appUrl: "vnd.youtube://", webUrl: "https://youtube.com/" },
  { id: "instagram", label: "Instagram", color: "#E1306C", abbr: "IG", appUrl: "instagram://", webUrl: "https://instagram.com/" },
  { id: "facebook", label: "Facebook", color: "#1877F2", abbr: "FB", appUrl: "fb://", webUrl: "https://facebook.com/" },
  { id: "twitter", label: "Twitter", color: "#1DA1F2", abbr: "X", appUrl: "twitter://", webUrl: "https://twitter.com/" },
  { id: "tiktok", label: "TikTok", color: "#010101", abbr: "TT", appUrl: "snssdk1128://", webUrl: "https://tiktok.com/" },
];

const TRENDING_SONGS = [
  { id: 1, title: "Espresso", artist: "Sabrina Carpenter", likes: "4.2M", platform: "YouTube", thumbnail: "https://i.ytimg.com/vi/eVli-tstM5E/hqdefault.jpg", url: "https://youtube.com/watch?v=eVli-tstM5E" },
  { id: 2, title: "Die With A Smile", artist: "Lady Gaga & Bruno Mars", likes: "3.8M", platform: "YouTube", thumbnail: "https://i.ytimg.com/vi/kPa7bsKwL-c/hqdefault.jpg", url: "https://youtube.com/watch?v=kPa7bsKwL-c" },
  { id: 3, title: "APT.", artist: "ROSÉ & Bruno Mars", likes: "5.1M", platform: "YouTube", thumbnail: "https://i.ytimg.com/vi/ekr2nIex040/hqdefault.jpg", url: "https://youtube.com/watch?v=ekr2nIex040" },
  { id: 4, title: "Luther", artist: "Kendrick Lamar & SZA", likes: "2.9M", platform: "YouTube", thumbnail: "https://i.ytimg.com/vi/FX3OgO6dLi0/hqdefault.jpg", url: "https://youtube.com/watch?v=FX3OgO6dLi0" },
  { id: 5, title: "Timeless", artist: "The Weeknd & Playboi Carti", likes: "3.3M", platform: "YouTube", thumbnail: "https://i.ytimg.com/vi/b5e2gNKXFuE/hqdefault.jpg", url: "https://youtube.com/watch?v=b5e2gNKXFuE" },
  { id: 6, title: "Birds of a Feather", artist: "Billie Eilish", likes: "6.7M", platform: "YouTube", thumbnail: "https://i.ytimg.com/vi/zex3C0gIOK0/hqdefault.jpg", url: "https://youtube.com/watch?v=zex3C0gIOK0" },
];

const TrendingSongsFeed = ({ onDownload }: { onDownload: (url: string) => void }) => {
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-primary" />
        <p className="text-xs font-bold uppercase tracking-wider text-foreground">Trending Songs</p>
        <span className="ml-auto text-xs text-muted-foreground">This week</span>
      </div>
      <div className="flex flex-col gap-2">
        {TRENDING_SONGS.map((song, idx) => (
          <a
            key={song.id}
            href={song.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 rounded-2xl bg-secondary border border-border hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-98 group"
          >
            {/* Rank */}
            <span className="w-5 text-xs font-bold text-muted-foreground text-center shrink-0">{idx + 1}</span>
            {/* Thumbnail */}
            <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-muted">
              <img
                src={song.thumbnail}
                alt={song.title}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-background/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-5 h-5 text-white fill-white drop-shadow" />
              </div>
            </div>
            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{song.title}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Music2 className="w-3 h-3 text-muted-foreground shrink-0" />
                <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
              </div>
            </div>
            {/* Actions */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <button
                onClick={(e) => toggleLike(song.id, e)}
                className="flex flex-col items-center gap-0.5 px-1"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${liked.has(song.id) ? "fill-red-500 text-red-500" : "text-muted-foreground"}`}
                />
                <span className="text-xs text-muted-foreground">{song.likes}</span>
              </button>
              <button
                onClick={(e) => { e.preventDefault(); onDownload(song.url); }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <Download className="w-3 h-3" />
                DL
              </button>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

const HomeTab = () => {
  const [url, setUrl] = useState("");
  const [downloadState, setDownloadState] = useState<DownloadState>("idle");
  const [progress, setProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [medias, setMedias] = useState<any[]>([]);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [showShare, setShowShare] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      inputRef.current?.focus();
    } catch {
      inputRef.current?.focus();
    }
  };

  const handleFetch = async () => {
    if (!url.trim()) return;
    setDownloadState("fetching");
    setProgress(0);
    setVideoInfo(null);
    setMedias([]);

    try {
      const { data, error } = await supabase.functions.invoke("video-download", {
        body: { url: url.trim() },
      });

      if (error) throw new Error(error.message);

      const info = extractDownloadInfo(data);
      if (!info) throw new Error("Could not parse video info");

      // Pick best quality video media
      const videoMedias = info.medias.filter((m: any) => m.type === "video" || (!m.type && m.url));
      const audioMedias = info.medias.filter((m: any) => m.type === "audio");

      setMedias([...videoMedias, ...audioMedias]);
      setVideoInfo({
        title: info.title,
        thumbnail: info.thumbnail,
        duration: info.duration,
        platform: info.platform,
        resolution: videoMedias[0]?.quality || videoMedias[0]?.resolution || "Best",
        fileSize: videoMedias[0]?.size ? `${Math.round(videoMedias[0].size / 1024 / 1024)} MB` : "—",
      });
      setDownloadState("idle");
    } catch (err: any) {
      setDownloadState("error");
      toast({ title: "Failed to fetch video", description: err.message, variant: "destructive" });
      setDownloadState("idle");
    }
  };

  const handleDownload = (selectedRes?: string) => {
    // Find the media matching selected resolution or pick best
    const target = medias.find((m) =>
      m.quality === selectedRes || m.resolution === selectedRes
    ) || medias[0];

    if (!target?.url) {
      toast({ title: "No download URL found", variant: "destructive" });
      return;
    }

    // Save URL for share sheet
    setShareUrl(target.url);

    // Trigger direct download — open in new tab so browser handles it
    window.open(target.url, "_blank", "noopener,noreferrer");

    // Simulate progress UI
    setDownloadState("downloading");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setDownloadState("done");
          setShowShare(true);
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
    setMedias([]);
    setShareUrl("");
    setShowShare(false);
  };

  const isFetching = downloadState === "fetching";

  return (
    <div className="flex flex-col gap-5 pb-4">
      {/* Hero */}
      <div className="text-center pt-2 pb-1">
        <h1 className="font-display text-2xl font-bold mb-1">
          <span className="gradient-text">Download</span> Any Video
        </h1>
        <p className="text-xs text-muted-foreground">YouTube, Instagram, Facebook, Twitter & 50+ sites</p>
      </div>

      {/* URL Input */}
      <div className="relative">
        <div className="flex items-center rounded-2xl border border-border bg-muted overflow-hidden transition-all focus-within:border-primary focus-within:shadow-glow">
          <Link2 className="absolute left-4 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleFetch()}
            placeholder="Paste video link here..."
            className="flex-1 bg-transparent pl-11 pr-2 py-4 text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          {url ? (
            <button onClick={() => setUrl("")} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handlePaste}
              className="flex items-center gap-1.5 mr-2 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold hover:bg-muted-foreground/10 transition-colors border border-border"
            >
              <Clipboard className="w-3.5 h-3.5" />
              Paste
            </button>
          )}
        </div>
      </div>

      {/* Fetch Button */}
      <Button
        onClick={handleFetch}
        disabled={!url.trim() || isFetching}
        size="lg"
        className="w-full bg-gradient-primary text-primary-foreground font-bold text-base rounded-2xl h-14 shadow-glow hover:opacity-90 transition-opacity disabled:opacity-40 animate-pulse-glow"
      >
        {isFetching ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            Fetching...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Fetch Video
          </span>
        )}
      </Button>

      {/* Platform Icons */}
      <div>
        <p className="text-xs text-muted-foreground mb-3 text-center uppercase tracking-wider font-medium">Supported Platforms</p>
        <div className="flex justify-center gap-4">
          {PLATFORMS.map((p) => (
            <a
              key={p.id}
              href={p.appUrl}
              onClick={(e) => {
                // Try app deep link; fall back to web after short delay
                setTimeout(() => { window.location.href = p.webUrl; }, 1500);
              }}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-extrabold shadow-md border-2 border-transparent group-hover:scale-110 transition-transform"
                style={{ backgroundColor: p.color, color: "#fff", borderColor: p.color + "44" }}
              >
                {p.abbr}
              </div>
              <span className="text-xs text-muted-foreground">{p.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Video Preview — shown above trending feed after fetch */}
      {videoInfo && (
        <VideoPreview
          info={videoInfo}
          downloadState={downloadState}
          onDownload={handleDownload}
          onReset={handleReset}
          medias={medias}
        />
      )}

      {/* Download Progress */}
      {(downloadState === "downloading" || downloadState === "done") && (
        <DownloadProgress progress={Math.min(progress, 100)} state={downloadState} />
      )}

      {/* Trending Songs Feed */}
      <TrendingSongsFeed onDownload={(songUrl) => {
        setUrl(songUrl);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(async () => {
          setDownloadState("fetching");
          setProgress(0);
          setVideoInfo(null);
          setMedias([]);
          try {
            const { data, error } = await supabase.functions.invoke("video-download", { body: { url: songUrl } });
            if (error) throw new Error(error.message);
            const info = extractDownloadInfo(data);
            if (!info) throw new Error("Could not parse video info");
            const videoMedias = info.medias.filter((m: any) => m.type === "video" || (!m.type && m.url));
            const audioMedias = info.medias.filter((m: any) => m.type === "audio");
            setMedias([...videoMedias, ...audioMedias]);
            setVideoInfo({ title: info.title, thumbnail: info.thumbnail, duration: info.duration, platform: info.platform, resolution: videoMedias[0]?.quality || videoMedias[0]?.resolution || "Best", fileSize: videoMedias[0]?.size ? `${Math.round(videoMedias[0].size / 1024 / 1024)} MB` : "—" });
            setDownloadState("idle");
          } catch (err: any) {
            setDownloadState("error");
            toast({ title: "Failed to fetch video", description: err.message, variant: "destructive" });
            setDownloadState("idle");
          }
        }, 100);
      }} />

      <Toaster />

      <ShareSheet
        open={showShare}
        onClose={() => setShowShare(false)}
        title={videoInfo?.title || "Video"}
        url={shareUrl}
      />
    </div>
  );
};

export default HomeTab;
