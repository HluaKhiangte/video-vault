import { useState } from "react";
import { Download, Share2, Image, Video, MessageCircle, AlertCircle, ExternalLink, Clipboard, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

type SubTab = "guide" | "paste";

const STEPS = [
  { step: "1", text: "Open WhatsApp and view the status you want to save" },
  { step: "2", text: "On Android: go to File Manager → WhatsApp → .Statuses folder" },
  { step: "3", text: "Copy the direct file link or use a file manager app to share" },
  { step: "4", text: "Paste the status URL below to download it here" },
];

const StatusSaverTab = () => {
  const [subTab, setSubTab] = useState<SubTab>("guide");
  const [url, setUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [saved, setSaved] = useState<{ url: string; type: string; time: string }[]>([]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {
      toast({ title: "Paste manually", description: "Allow clipboard access or paste the URL manually." });
    }
  };

  const handleSave = () => {
    if (!url.trim()) {
      toast({ title: "Enter a URL", description: "Paste the WhatsApp status URL first.", variant: "destructive" });
      return;
    }
    // Open URL directly for download
    window.open(url.trim(), "_blank", "noopener,noreferrer");
    setSaved((prev) => [{ url: url.trim(), type: mediaType, time: new Date().toLocaleTimeString() }, ...prev]);
    toast({ title: "Opening status…", description: "Long-press the media to save it to your device." });
    setUrl("");
  };

  return (
    <div className="flex flex-col gap-4 pb-4">
      <Toaster />
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#25D366" }}>
          <MessageCircle className="w-5 h-5 text-background fill-background" />
        </div>
        <div>
          <h2 className="font-display font-bold text-base text-foreground">WhatsApp Status Saver</h2>
          <p className="text-xs text-muted-foreground">Save statuses before they disappear</p>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 p-1 bg-secondary rounded-2xl">
        <button
          onClick={() => setSubTab("guide")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            subTab === "guide" ? "bg-background text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          How It Works
        </button>
        <button
          onClick={() => setSubTab("paste")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            subTab === "paste" ? "bg-background text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Download className="w-4 h-4" />
          Save Status
        </button>
      </div>

      {subTab === "guide" && (
        <div className="flex flex-col gap-3">
          {/* Info banner */}
          <div className="rounded-xl border border-border bg-muted p-3 flex gap-3 items-start">
            <AlertCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              WhatsApp statuses are stored on your device. Web browsers cannot access your phone's local files directly.
              Follow the steps below to save a status.
            </p>
          </div>

          {/* Steps */}
          {STEPS.map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3 rounded-xl bg-card border border-border p-3">
              <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                {step}
              </div>
              <p className="text-sm text-foreground leading-snug mt-0.5">{text}</p>
            </div>
          ))}

          <button
            onClick={() => setSubTab("paste")}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold text-sm"
          >
            I have the URL — Save Now →
          </button>
        </div>
      )}

      {subTab === "paste" && (
        <div className="flex flex-col gap-4">
          {/* Media type toggle */}
          <div className="flex gap-2 p-1 bg-secondary rounded-xl">
            <button
              onClick={() => setMediaType("image")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                mediaType === "image" ? "bg-background text-foreground shadow-card" : "text-muted-foreground"
              }`}
            >
              <Image className="w-4 h-4" /> Image
            </button>
            <button
              onClick={() => setMediaType("video")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
                mediaType === "video" ? "bg-background text-foreground shadow-card" : "text-muted-foreground"
              }`}
            >
              <Video className="w-4 h-4" /> Video
            </button>
          </div>

          {/* URL Input */}
          <div className="flex items-center rounded-2xl border border-border bg-muted overflow-hidden focus-within:border-primary focus-within:shadow-glow transition-all">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste WhatsApp status URL…"
              className="flex-1 bg-transparent pl-4 pr-2 py-4 text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            {url ? (
              <button onClick={() => setUrl("")} className="p-2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handlePaste}
                className="flex items-center gap-1.5 mr-2 px-3 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-semibold border border-border"
              >
                <Clipboard className="w-3.5 h-3.5" /> Paste
              </button>
            )}
          </div>

          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-bold text-base flex items-center justify-center gap-2 shadow-glow"
          >
            <Download className="w-5 h-5" />
            Save to Device
          </button>

          {/* Saved history */}
          {saved.length > 0 && (
            <div className="flex flex-col gap-2 mt-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Saved This Session</p>
              {saved.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl bg-card border border-border p-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {item.type === "video" ? <Video className="w-4 h-4 text-primary" /> : <Image className="w-4 h-4 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate">{item.url}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                  <button
                    onClick={() => window.open(item.url, "_blank", "noopener,noreferrer")}
                    className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatusSaverTab;
