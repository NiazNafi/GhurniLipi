import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase is optional at this stage.
 *
 * The catalogue lives in src/data/catalog.ts and the site renders perfectly
 * from it, so `npm run dev` works on a fresh clone with no .env at all. Set
 * the two public vars and the same code starts reading the database instead.
 */

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(URL && ANON_KEY);

let cached: SupabaseClient | null = null;

/** Returns null when the project has no Supabase credentials. */
export function getSupabase(): SupabaseClient | null {
  if (!URL || !ANON_KEY) return null;
  cached ??= createClient(URL, ANON_KEY, {
    auth: { persistSession: false },
  });
  return cached;
}

/** Row shape of public.artworks. */
export interface ArtworkRow {
  id: string;
  kind: "couple" | "single" | "word";
  script: "bangla" | "latin";
  reads: { bn: string; en: string }[];
  featured: boolean;
  sort_order: number;
  note_bn: string | null;
  note_en: string | null;
}
