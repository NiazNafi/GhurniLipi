"use client";

import { useEffect } from "react";

import { useUiStore } from "@/store/ui";

/**
 * Replays persisted state after mount.
 *
 * The store is created with `skipHydration` so the first client render matches
 * the server's Bangla default; this pulls the saved language in one tick later.
 * A returning English reader sees one frame of Bangla, which is the cheapest
 * correct answer short of locale-prefixed routing.
 */
export function StoreHydration() {
  useEffect(() => {
    void useUiStore.persist.rehydrate();
  }, []);

  // Keep <html lang> honest for screen readers and for Bengali line breaking.
  const lang = useUiStore((s) => s.lang);
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return null;
}
