import { useState } from "react";
import { Download, Share2, Image, Video, MessageCircle } from "lucide-react";

const MOCK_IMAGES = [
  { id: 1, url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80", time: "10:32 AM" },
  { id: 2, url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80", time: "9:14 AM" },
  { id: 3, url: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80", time: "Yesterday" },
  { id: 4, url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&q=80", time: "Yesterday" },
  { id: 5, url: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400&q=80", time: "Mon" },
  { id: 6, url: "https://images.unsplash.com/photo-1490750967868-88df5691cc10?w=400&q=80", time: "Mon" },
];

const MOCK_VIDEOS = [
  { id: 1, url: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&q=80", duration: "0:28", time: "11:05 AM" },
  { id: 2, url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80", duration: "1:14", time: "Yesterday" },
  { id: 3, url: "https://images.unsplash.com/photo-1551817958-d9d86fb29431?w=400&q=80", duration: "0:47", time: "Mon" },
  { id: 4, url: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=400&q=80", duration: "2:03", time: "Sun" },
];

type SubTab = "images" | "videos";

const StatusSaverTab = () => {
  const [subTab, setSubTab] = useState<SubTab>("images");
  const [saved, setSaved] = useState<Set<number>>(new Set());

  const handleSave = (id: number) => {
    setSaved((prev) => new Set([...prev, id]));
  };

  const items = subTab === "images" ? MOCK_IMAGES : MOCK_VIDEOS;

  return (
    <div className="flex flex-col gap-4 pb-4">
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

      {/* Sub-tabs toggle */}
      <div className="flex gap-1 p-1 bg-secondary rounded-2xl">
        <button
          onClick={() => setSubTab("images")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            subTab === "images"
              ? "bg-background text-foreground shadow-card"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Image className="w-4 h-4" />
          Images
          <span className="text-xs rounded-full px-1.5 py-0.5 bg-primary/20 text-primary font-bold">
            {MOCK_IMAGES.length}
          </span>
        </button>
        <button
          onClick={() => setSubTab("videos")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            subTab === "videos"
              ? "bg-background text-foreground shadow-card"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Video className="w-4 h-4" />
          Videos
          <span className="text-xs rounded-full px-1.5 py-0.5 bg-primary/20 text-primary font-bold">
            {MOCK_VIDEOS.length}
          </span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => {
          const isSaved = saved.has(item.id);
          return (
            <div key={item.id} className="relative group rounded-xl overflow-hidden bg-secondary aspect-square border border-border">
              <img src={item.url} alt="" className="w-full h-full object-cover" />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  onClick={() => handleSave(item.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${
                    isSaved
                      ? "bg-success text-success-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  <Download className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-secondary/90 text-foreground flex items-center justify-center shadow-lg active:scale-90">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Always-visible action strip at bottom */}
              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1.5 bg-gradient-to-t from-background/90 to-transparent">
                <span className="text-xs text-foreground/70">
                  {"duration" in item ? (item as typeof MOCK_VIDEOS[0]).duration : item.time}
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleSave(item.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isSaved ? "text-success" : "text-foreground/80 hover:text-primary"
                    }`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-6 h-6 rounded-full flex items-center justify-center text-foreground/80 hover:text-primary">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Video play indicator */}
              {"duration" in item && (
                <div className="absolute top-2 left-2 bg-background/70 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-mono text-foreground">
                  ▶ {(item as typeof MOCK_VIDEOS[0]).duration}
                </div>
              )}

              {/* Saved badge */}
              {isSaved && (
                <div className="absolute top-2 right-2 bg-success rounded-full px-2 py-0.5 text-xs text-success-foreground font-semibold">
                  Saved
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusSaverTab;
