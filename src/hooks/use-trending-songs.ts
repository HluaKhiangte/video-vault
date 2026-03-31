import { useEffect, useState } from "react";

export interface TrendingSong {
  id: number;
  title: string;
  artist: string;
  thumbnail: string;
  searchUrl: string;
}

export function useTrendingSongs(countryCode: string = "us") {
  const [songs, setSongs] = useState<TrendingSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchSongs = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://itunes.apple.com/${countryCode}/rss/topsongs/limit=10/json`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        const entries: any[] = json?.feed?.entry ?? [];

        const parsed: TrendingSong[] = entries.map((entry, idx) => {
          const fullTitle: string = entry?.title?.label ?? "Unknown";
          const dashIdx = fullTitle.lastIndexOf(" - ");
          const title = dashIdx !== -1 ? fullTitle.slice(0, dashIdx) : fullTitle;
          const artist = dashIdx !== -1 ? fullTitle.slice(dashIdx + 3) : entry?.["im:artist"]?.label ?? "Unknown Artist";
          const images: any[] = entry?.["im:image"] ?? [];
          const thumbnail = images.find((img) => img?.attributes?.height === "170")?.label ?? images[images.length - 1]?.label ?? "";
          const query = encodeURIComponent(`${title} ${artist} official`);
          const searchUrl = `https://www.youtube.com/results?search_query=${query}`;
          return { id: idx + 1, title, artist, thumbnail, searchUrl };
        });

        if (!cancelled) setSongs(parsed);
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSongs();
    return () => { cancelled = true; };
  }, [countryCode]);

  return { songs, loading, error };
}
