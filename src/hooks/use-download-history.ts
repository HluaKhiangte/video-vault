import { useState, useEffect, useCallback } from "react";

export interface DownloadHistoryItem {
  id: string;
  title: string;
  thumbnail: string;
  platform: string;
  format: string; // e.g. "MP4", "M4A", "WEBM"
  resolution: string;
  size: string;
  date: string; // ISO timestamp
  type: "video" | "audio";
  sourceUrl?: string;
}

const STORAGE_KEY = "download_history_v1";

function readStorage(): DownloadHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStorage(items: DownloadHistoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota errors
  }
}

export function useDownloadHistory() {
  const [history, setHistory] = useState<DownloadHistoryItem[]>(() => readStorage());

  // Sync across tabs
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setHistory(readStorage());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addItem = useCallback((item: Omit<DownloadHistoryItem, "id" | "date">) => {
    const newItem: DownloadHistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date: new Date().toISOString(),
    };
    setHistory((prev) => {
      const next = [newItem, ...prev].slice(0, 100); // cap at 100
      writeStorage(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((i) => i.id !== id);
      writeStorage(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setHistory([]);
    writeStorage([]);
  }, []);

  return { history, addItem, removeItem, clearAll };
}

export function formatRelativeDate(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "Just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} hr ago`;
  const days = Math.floor(hr / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
