"use client";

import { create } from "zustand";
import { defaultContent, type UniverseContent } from "@/data/default-content";

export type ViewId = "home" | "umrah" | "sertifikasi" | "muhdin" | "market" | "grand" | "admin";

interface UniverseState {
  view: ViewId;
  content: UniverseContent;
  loadingContent: boolean;
  setView: (v: ViewId) => void;
  setContent: (c: UniverseContent) => void;
  refreshContent: () => Promise<void>;
}

export const useUniverse = create<UniverseState>((set) => ({
  view: "home",
  content: defaultContent,
  loadingContent: false,
  setView: (v) => {
    set({ view: v });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      try {
        window.history.replaceState(null, "", `#${v}`);
      } catch {
        /* noop */
      }
    }
  },
  setContent: (c) => set({ content: c }),
  refreshContent: async () => {
    set({ loadingContent: true });
    try {
      const res = await fetch("/api/content", { cache: "no-store" });
      const json = (await res.json()) as { ok: boolean; content?: UniverseContent };
      if (json.ok && json.content) set({ content: json.content });
    } finally {
      set({ loadingContent: false });
    }
  },
}));
