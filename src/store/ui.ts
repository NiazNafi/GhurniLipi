"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { ArtworkKind, Lang, ScriptKind } from "@/lib/types";

export type KindFilter = ArtworkKind | "all";
export type ScriptFilter = ScriptKind | "all";

interface UiState {
  /** Bangla is the default because Bangladesh is the market (requirements §4.6). */
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;

  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;

  /**
   * True once the visitor has turned any piece. The rotation hint is the whole
   * pitch on first view, and noise on the fourth — so it retires itself.
   */
  hasTurned: boolean;
  markTurned: () => void;

  kind: KindFilter;
  script: ScriptFilter;
  setKind: (kind: KindFilter) => void;
  setScript: (script: ScriptFilter) => void;
  clearFilters: () => void;
  hasFilters: () => boolean;
}

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      lang: "bn",
      setLang: (lang) => set({ lang }),
      toggleLang: () => set({ lang: get().lang === "bn" ? "en" : "bn" }),

      menuOpen: false,
      setMenuOpen: (menuOpen) => set({ menuOpen }),

      hasTurned: false,
      markTurned: () => {
        if (!get().hasTurned) set({ hasTurned: true });
      },

      kind: "all",
      script: "all",
      setKind: (kind) => set({ kind }),
      setScript: (script) => set({ script }),
      clearFilters: () => set({ kind: "all", script: "all" }),
      hasFilters: () => get().kind !== "all" || get().script !== "all",
    }),
    {
      name: "ghurnilipi-ui",
      storage: createJSONStorage(() => localStorage),
      /**
       * Only the language and the retired hint are worth remembering. Filters
       * belong to a visit, and the menu to a moment.
       */
      partialize: (state) => ({ lang: state.lang, hasTurned: state.hasTurned }),
      /**
       * Rehydration is deferred to an effect in <StoreHydration />. Reading
       * localStorage during store creation would make the first client render
       * disagree with the server-rendered Bangla and trip a hydration error.
       */
      skipHydration: true,
      version: 1,
    },
  ),
);

/** Convenience selector — the language, which nearly every component needs. */
export const useLang = () => useUiStore((s) => s.lang);
