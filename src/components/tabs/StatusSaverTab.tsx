import { useState, useEffect } from "react";
import { Download, Image, Video, MessageCircle, FolderOpen, CheckCircle, Trash2 } from "lucide-react";

type SavedStatus = {
  name: string;
  dataUrl: string;
  type: "image" | "video";
  savedAt: string;
};

type SubTab = "images" | "videos";

const STORAGE_KEY = "wa_saved_statuses";

const loadSaved = (): SavedStatus[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const StatusSaverTab = () => {
  const [subTab, setSubTab] = useState<SubTab>("images");
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [previews, setPreviews] = useState<SavedStatus[]>([]);
  const [saved, setSaved] = useState<SavedStatus[]>(loadSaved());

  // Persist saved to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }, [saved]);

  const handleOpenFolder = async () => {
    if (!("showDirectoryPicker" in window)) {
      alert("Your browser does not support folder access. Please use Chrome or Edge on Android.");
      return;
    }
    setLoading(true);
    try {
      // @ts-ignore
      const dirHandle = await window.showDirectoryPicker({ mode: "read" });
      const loaded: SavedStatus[] = [];

      for await (const [name, handle] of dirHandle.entries()) {
        if (handle.kind !== "file") continue;
        const lower = name.toLowerCase();
        const isImage = lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".webp");
        const isVideo = lower.endsWith(".mp4") || lower.endsWith(".3gp") || lower.endsWith(".mkv");
        if (!isImage && !isVideo) continue;

        const file = await handle.getFile();
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        loaded.push({ name, dataUrl, type: isImage ? "image" : "video", savedAt: new Date().toISOString() });
      }

      setPreviews(loaded);
      setHasLoaded(true);
    } catch (e: any) {
      if (e.name !== "AbortError") alert("Could not open folder: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (item: SavedStatus) => {
    // Download the file
    const a = document.createElement("a");
    a.href = item.dataUrl;
    a.download = item.name;
    a.click();

    // Add to saved collection if not already there
    setSaved((prev) => {
      if (prev.find((s) => s.name === item.name)) return prev;
      return [{ ...item, savedAt: new Date().toISOString() }, ...prev];
    });
  };

  const handleRemoveSaved = (name: string) => {
    setSaved((prev) => prev.filter((s) => s.name !== name));
  };

  const isSaved = (name: string) => saved.some((s) => s.name === name);

  const displayedPreviews = previews.filter((i) => i.type === (subTab === "images" ? "image" : "video"));
  const displayedSaved = saved.filter((i) => i.type === (subTab === "images" ? "image" : "video"));
  const imageCount = previews.filter((i) => i.type === "image").length;
  const videoCount = previews.filter((i) => i.type === "video").length;
  const savedImageCount = saved.filter((i) => i.type === "image").length;
  const savedVideoCount = saved.filter((i) => i.type === "video").length;

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#25D366" }}>
          <MessageCircle className="w-5 h-5 text-white fill-white" />
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

      {hasLoaded && previews.length === 0 && (
        <div className="rounded-xl bg-muted border border-border p-4 text-center">
          <p className="text-sm text-muted-foreground">No statuses found in that folder.</p>
          <p className="text-xs text-muted-foreground mt-1">Make sure you've viewed the statuses in WhatsApp first.</p>
        </div>
      )}

      {/* Sub-tabs */}
      {(previews.length > 0 || saved.length > 0) && (
        <div className="flex gap-1 p-1 bg-secondary rounded-2xl">
          <button
            onClick={() => setSubTab("images")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              subTab === "images" ? "bg-background text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Image className="w-4 h-4" /> Images
            <span className="text-xs rounded-full px-1.5 py-0.5 bg-primary/20 text-primary font-bold">
              {hasLoaded ? imageCount : savedImageCount}
            </span>
          </button>
          <button
            onClick={() => setSubTab("videos")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              subTab === "videos" ? "bg-background text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Video className="w-4 h-4" /> Videos
            <span className="text-xs rounded-full px-1.5 py-0.5 bg-primary/20 text-primary font-bold">
              {hasLoaded ? videoCount : savedVideoCount}
            </span>
          </button>
        </div>
      )}

      {/* Live previews from folder */}
      {hasLoaded && displayedPreviews.length > 0 && (
        <>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Viewed Statuses</p>
          <div className="grid grid-cols-2 gap-2">
            {displayedPreviews.map((item) => (
              <div key={item.name} className="relative rounded-xl overflow-hidden bg-secondary aspect-square border border-border">
                {item.type === "image" ? (
                  <img src={item.dataUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <video src={item.dataUrl} className="w-full h-full object-cover" muted playsInline controls />
                )}
                {item.type === "video" && (
                  <div className="absolute top-2 left-2 bg-background/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-mono text-foreground flex items-center gap-1">
                    <Video className="w-3 h-3" /> Video
                  </div>
                )}
                {isSaved(item.name) && (
                  <div className="absolute top-2 right-2 bg-success rounded-full p-1">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-end px-2 py-2 bg-gradient-to-t from-background/90 to-transparent">
                  <button
                    onClick={() => handleSave(item)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow transition-all active:scale-95 ${
                      isSaved(item.name)
                        ? "bg-success text-white"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                    {isSaved(item.name) ? "Saved" : "Save"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Saved statuses from localStorage */}
      {displayedSaved.length > 0 && (
        <>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mt-2">Saved Statuses</p>
          <div className="grid grid-cols-2 gap-2">
            {displayedSaved.map((item) => (
              <div key={item.name} className="relative rounded-xl overflow-hidden bg-secondary aspect-square border border-border">
                {item.type === "image" ? (
                  <img src={item.dataUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <video src={item.dataUrl} className="w-full h-full object-cover" muted playsInline controls />
                )}
                {item.type === "video" && (
                  <div className="absolute top-2 left-2 bg-background/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-mono text-foreground flex items-center gap-1">
                    <Video className="w-3 h-3" /> Video
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-success rounded-full p-1">
                  <CheckCircle className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-2 bg-gradient-to-t from-background/90 to-transparent">
                  <button
                    onClick={() => handleRemoveSaved(item.name)}
                    className="w-7 h-7 rounded-full bg-destructive/80 flex items-center justify-center active:scale-95"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                  </button>
                  <button
                    onClick={() => handleSave(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow bg-primary text-primary-foreground transition-all active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty saved state */}
      {!hasLoaded && saved.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
          <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center">
            <MessageCircle className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground">No saved statuses yet</p>
          <p className="text-xs text-muted-foreground">Open your WhatsApp .Statuses folder to browse and save</p>
        </div>
      )}
    </div>
  );
};

export default StatusSaverTab;
