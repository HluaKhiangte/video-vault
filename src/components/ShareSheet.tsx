import { useState } from "react";
import { Copy, Share2, CheckCheck, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

const ShareSheet = ({ open, onClose, title, url }: Props) => {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled or not supported
      }
    }
  };

  const handleOpenInBrowser = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const canNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Bottom sheet */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg animate-fade-in">
        <div className="mx-4 mb-6 rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Share2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Share</p>
                <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-muted hover:bg-muted-foreground/10 transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* URL preview */}
          <div className="mx-5 mt-4 px-3 py-2.5 rounded-xl bg-muted border border-border">
            <p className="text-xs text-muted-foreground truncate font-mono">{url}</p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 p-5">
            <Button
              onClick={handleCopy}
              variant="outline"
              className={`flex items-center gap-2 h-14 rounded-2xl border-border transition-all ${
                copied ? "border-success text-success bg-success/5" : "hover:border-primary/40"
              }`}
            >
              {copied ? (
                <>
                  <CheckCheck className="w-4 h-4" />
                  <span className="text-sm font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span className="text-sm font-semibold">Copy Link</span>
                </>
              )}
            </Button>

            <Button
              onClick={handleOpenInBrowser}
              variant="outline"
              className="flex items-center gap-2 h-14 rounded-2xl border-border hover:border-primary/40 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="text-sm font-semibold">Open Link</span>
            </Button>

            {canNativeShare && (
              <Button
                onClick={handleNativeShare}
                className="col-span-2 flex items-center gap-2 h-14 rounded-2xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow hover:opacity-90 transition-opacity"
              >
                <Share2 className="w-4 h-4" />
                Share via...
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareSheet;
