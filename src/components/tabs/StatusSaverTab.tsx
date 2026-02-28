import { useState, useRef } from "react";
import { Download, Image, Video, MessageCircle, FolderOpen, CheckCircle } from "lucide-react";

type MediaItem = {
  name: string;
  url: string;
  type: "image" | "video";
  file: File;
};

type SubTab = "images" | "videos";

const StatusSaverTab = () => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [subTab, setSubTab] = useState<SubTab>("images");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  const handleOpenFolder = async () => {
    if (!("showDirectoryPicker" in window)) {
      alert("Your browser does not support folder access. Please use Chrome or Edge on Android.");
      return;
    }
    setLoading(true);
    try {
      // @ts-ignore
      const dirHandle = await window.showDirectoryPicker({ mode: "read" });
      const loaded: MediaItem[] = [];

      for await (const [name, handle] of dirHandle.entries()) {
        if (handle.kind !== "file") continue;
        const lower = name.toLowerCase();
        const isImage = lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".webp");
        const isVideo = lower.endsWith(".mp4") || lower.endsWith(".3gp") || lower.endsWith(".mkv");
        if (!isImage && !isVideo) continue;

        const file = await handle.getFile();
        const url = URL.createObjectURL(file);
        loaded.push({ name, url, type: isImage ? "image" : "video", file });
      }

      setItems(loaded);
      setHasLoaded(true);
    } catch (e: any) {
      if (e.name !== "AbortError") alert("Could not open folder: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (item: MediaItem) => {
    const a = document.createElement("a");
    a.href = item.url;
    a.download = item.name;
    a.click();
    setSaved((prev) => new Set([...prev, item.name]));
  };

  const displayed = items.filter((i) => i.type === subTab.replace("s", "") as "image" | "video");
  const imageCount = items.filter((i) => i.type === "image").length;
  const videoCount = items.filter((i) => i.type === "video").length;

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#25D366" }}>
          <MessageCircle className="w-5 h-5 text-background fill-background" />
        </div>
        <div>
          <h2 className="font-display font-bold text-base text-foreground">WhatsApp Status Saver</h2>
          <p className="text-xs text-muted-foreground">Open your .Statuses folder to view & save</p>
        </div>
      </div>

      {/* Open Folder Button */}
      <button
        onClick={handleOpenFolder}
        disabled={loading}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-primary/40 bg-primary/5 flex flex-col items-center justify-center gap-2 active:scale-98 transition-all hover:border-primary/70 hover:bg-primary/10"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          <FolderOpen className="w-7 h-7 text-primary" />
        )}
        <span className="text-sm font-bold text-foreground">
          {hasLoaded ? "Reload Statuses Folder" : "Open WhatsApp Statuses Folder"}
        </span>
        <span className="text-xs text-muted-foreground text-center px-4">
          Navigate to: <strong>Android → media → com.whatsapp → WhatsApp → Media → .Statuses</strong>
        </span>
      </button>

      {hasLoaded && items.length === 0 && (
        <div className="rounded-xl bg-muted border border-border p-4 text-center">
          <p className="text-sm text-muted-foreground">No statuses found in that folder.</p>
          <p className="text-xs text-muted-foreground mt-1">Make sure you've viewed the statuses in WhatsApp first.</p>
        </div>
      )}

      {items.length > 0 && (
        <>
          {/* Sub-tabs */}
          <div className="flex gap-1 p-1 bg-secondary rounded-2xl">
            <button
              onClick={() => setSubTab("images")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                subTab === "images" ? "bg-background text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Image className="w-4 h-4" /> Images
              <span className="text-xs rounded-full px-1.5 py-0.5 bg-primary/20 text-primary font-bold">{imageCount}</span>
            </button>
            <button
              onClick={() => setSubTab("videos")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                subTab === "videos" ? "bg-background text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Video className="w-4 h-4" /> Videos
              <span className="text-xs rounded-full px-1.5 py-0.5 bg-primary/20 text-primary font-bold">{videoCount}</span>
            </button>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-2">
            {displayed.map((item) => {
              const isSaved = saved.has(item.name);
              return (
                <div key={item.name} className="relative rounded-xl overflow-hidden bg-secondary aspect-square border border-border group">
                  {item.type === "image" ? (
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <video src={item.url} className="w-full h-full object-cover" muted playsInline />
                  )}

                  {/* Video indicator */}
                  {item.type === "video" && (
                    <div className="absolute top-2 left-2 bg-background/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-mono text-foreground flex items-center gap-1">
                      <Video className="w-3 h-3" /> Video
                    </div>
                  )}

                  {/* Saved badge */}
                  {isSaved && (
                    <div className="absolute top-2 right-2 bg-success rounded-full p-1">
                      <CheckCircle className="w-3.5 h-3.5 text-success-foreground" />
                    </div>
                  )}

                  {/* Download strip - always visible on mobile */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-center justify-end px-2 py-2 bg-gradient-to-t from-background/90 to-transparent">
                    <button
                      onClick={() => handleDownload(item)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow transition-all active:scale-95 ${
                        isSaved
                          ? "bg-success text-success-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      {isSaved ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default StatusSaverTab;
