import { useState } from "react";
import { Smartphone, FolderOpen, Image, Video, MessageCircle, Info, ChevronRight } from "lucide-react";

type Device = "android" | "ios";

const ANDROID_STEPS = [
  {
    icon: MessageCircle,
    title: "View the Status",
    desc: "Open WhatsApp and watch the status you want to save (must be viewed first).",
  },
  {
    icon: FolderOpen,
    title: "Open File Manager",
    desc: 'Go to your phone\'s File Manager app and enable "Show Hidden Files".',
  },
  {
    icon: FolderOpen,
    title: "Navigate to WhatsApp folder",
    desc: "Internal Storage → Android → media → com.whatsapp → WhatsApp → Media → .Statuses",
  },
  {
    icon: Image,
    title: "Copy the file",
    desc: "Long-press the image or video, then copy or move it to your Gallery / Downloads folder.",
  },
];

const IOS_STEPS = [
  {
    icon: MessageCircle,
    title: "View the Status",
    desc: "Open WhatsApp and watch the status you want to save.",
  },
  {
    icon: Smartphone,
    title: "Screen Record (Videos)",
    desc: 'Swipe to Control Center, tap the Record button, then play the status. Stop recording when done.',
  },
  {
    icon: Image,
    title: "Screenshot (Images)",
    desc: "Take a screenshot while the image status is displayed on screen.",
  },
  {
    icon: Info,
    title: "Note",
    desc: "iOS does not allow access to WhatsApp's local storage. Screen recording and screenshots are the only native options.",
  },
];

const StatusSaverTab = () => {
  const [device, setDevice] = useState<Device>("android");

  const steps = device === "android" ? ANDROID_STEPS : IOS_STEPS;

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "#25D366" }}>
          <MessageCircle className="w-5 h-5 text-background fill-background" />
        </div>
        <div>
          <h2 className="font-display font-bold text-base text-foreground">WhatsApp Status Saver</h2>
          <p className="text-xs text-muted-foreground">Step-by-step guide to save statuses</p>
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-xl border border-border bg-muted p-3 flex gap-3 items-start">
        <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          WhatsApp statuses are saved <strong className="text-foreground">locally on your device</strong> — they don't have a URL. Follow the steps below based on your phone type.
        </p>
      </div>

      {/* Device toggle */}
      <div className="flex gap-1 p-1 bg-secondary rounded-2xl">
        <button
          onClick={() => setDevice("android")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            device === "android" ? "bg-background text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Android
        </button>
        <button
          onClick={() => setDevice("ios")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            device === "ios" ? "bg-background text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          iPhone (iOS)
        </button>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-3">
        {steps.map(({ icon: Icon, title, desc }, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl bg-card border border-border p-4">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground mb-0.5">{title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {device === "android" && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 flex gap-3 items-start">
          <FolderOpen className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-foreground mb-0.5">Tip: Use a dedicated app</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Apps like <strong className="text-foreground">Status Saver for WhatsApp</strong> on the Play Store can do this automatically — they read from the .Statuses folder and let you save with one tap.
            </p>
          </div>
        </div>
      )}

      {device === "ios" && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 flex gap-3 items-start">
          <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-foreground mb-0.5">Tip: Use Documents app</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The <strong className="text-foreground">Documents by Readdle</strong> app can sometimes browse WhatsApp's shared storage on iOS, though access depends on your iOS version.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusSaverTab;
