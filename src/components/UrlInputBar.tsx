import { Link2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  url: string;
  setUrl: (v: string) => void;
  onFetch: () => void;
  isLoading: boolean;
}

const UrlInputBar = ({ url, setUrl, onFetch, isLoading }: Props) => {
  return (
    <div className="mb-5 animate-fade-in">
      <div className="relative flex items-center rounded-2xl border border-border bg-muted overflow-hidden transition-all focus-within:border-primary focus-within:shadow-glow">
        <Link2 className="absolute left-4 w-4 h-4 text-muted-foreground shrink-0 pointer-events-none" />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onFetch()}
          placeholder="Paste video URL here..."
          className="flex-1 bg-transparent pl-11 pr-4 py-4 text-sm text-foreground placeholder:text-muted-foreground outline-none"
        />
        {url && (
          <button
            onClick={() => setUrl("")}
            className="p-2 mr-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <Button
          onClick={onFetch}
          disabled={!url.trim() || isLoading}
          variant="default"
          size="sm"
          className="mr-2 shrink-0 bg-gradient-primary text-primary-foreground font-semibold px-5 hover:opacity-90 transition-opacity disabled:opacity-40"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Fetching
            </span>
          ) : (
            "Fetch"
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 px-1">
        Supports YouTube, Instagram, Facebook, Twitter/X, TikTok and 50+ sites
      </p>
    </div>
  );
};

export default UrlInputBar;
