import { useEffect, useState } from "react";

export interface TrendingSong {
  id: number;
  title: string;
  artist: string;
  thumbnail: string;
  searchUrl: string;
}

export function useTrendingSongs() {
  const [songs, setSongs] = useState<TrendingSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch(
          "https://itunes.apple.com/us/rss/topsongs/limit=10/json"
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        const entries: any[] = json?.feed?.entry ?? [];

        const parsed: TrendingSong[] = entries.map((entry, idx) => {
          const fullTitle: string = entry?.title?.label ?? "Unknown";
          // title format: "Song Title - Artist Name"
          const dashIdx = fullTitle.lastIndexOf(" - ");
          const title =
            dashIdx !== -1 ? fullTitle.slice(0, dashIdx) : fullTitle;
          const artist =
            dashIdx !== -1
              ? fullTitle.slice(dashIdx + 3)
              : entry?.["im:artist"]?.label ?? "Unknown Artist";

          // Pick largest thumbnail (170px one at index 2)
          const images: any[] = entry?.["im:image"] ?? [];
          const thumbnail =
            images.find((img) => img?.attributes?.height === "170")?.label ??
            images[images.length - 1]?.label ??
            "";

          // Build a YouTube search URL so the DL button can fetch it
          const query = encodeURIComponent(`${title} ${artist} official`);
          const searchUrl = `https://www.youtube.com/results?search_query=${query}`;

          return { id: idx + 1, title, artist, thumbnail, searchUrl };
        });

        setSongs(parsed);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  return { songs, loading, error };
}
