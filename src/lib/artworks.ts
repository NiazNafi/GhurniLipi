import { CATALOG } from "@/data/catalog";
import manifest from "@/data/media-manifest.json";
import { getSupabase, type ArtworkRow } from "@/lib/supabase";
import type { Artwork, ArtworkKind, ScriptKind } from "@/lib/types";

/** One emitted file. `url` is absolute once assets live in Supabase Storage. */
export interface Rendition {
  width: number;
  url: string;
}

export interface MediaEntry {
  slug: string;
  renditions: Rendition[];
  width: number;
  height: number;
  aspect: number;
  blurDataURL: string;
}

const IMAGES = manifest.images as Record<string, MediaEntry>;

export const MOTION_CLIP = manifest.motion as Omit<MediaEntry, "slug"> & {
  slug: string;
  posters: Rendition[];
};

const brand = manifest.brand as {
  marks: Rendition[];
  icon: { url: string };
};

/** The roundel, in the same shape as an artwork so it can share the helpers. */
export const BRAND_MARK: { renditions: Rendition[] } = {
  renditions: brand.marks,
};

/** Favicon / apple-touch icon. */
export const BRAND_ICON = brand.icon.url;

/**
 * Where the media is actually served from. "local" until
 * `npm run assets:upload` has run, "supabase" afterwards.
 */
export const MEDIA_STORAGE = manifest.storage as {
  provider: "local" | "supabase";
  bucket?: string;
  baseUrl: string;
};

export function getMedia(slug: string): MediaEntry | undefined {
  return IMAGES[slug];
}

/**
 * Builds a srcset from whatever URLs the manifest holds.
 *
 * These are plain <img> sources, not next/image — the pipeline already produced
 * exactly the widths this site uses, so on-demand optimisation would be a second
 * resize of a finished file. It also means moving the bytes to Supabase Storage
 * needed no change here beyond reading `url` instead of assembling a path.
 */
export function srcSetFor(entry: { renditions: Rendition[] }): string {
  return entry.renditions.map((r) => `${r.url} ${r.width}w`).join(", ");
}

/**
 * The `src` a browser falls back to when it ignores srcset.
 *
 * A middle rendition, not the widest — anything old enough to skip srcset is
 * also likely to be on a phone and a slow connection, and handing it the
 * 1600px file would be the worst pairing of the two.
 */
export function defaultSrc(entry: { renditions: Rendition[] }): string {
  const list = entry.renditions;
  return list[Math.min(1, list.length - 1)].url;
}

/** Widest rendition — for OG images and anything that wants one fixed URL. */
export function widestSrc(entry: { renditions: Rendition[] }): string {
  return entry.renditions.at(-1)!.url;
}

function rowToArtwork(row: ArtworkRow): Artwork {
  return {
    id: row.id,
    kind: row.kind,
    script: row.script,
    reads: row.reads,
    featured: row.featured,
    order: row.sort_order,
    note:
      row.note_bn || row.note_en
        ? { bn: row.note_bn ?? "", en: row.note_en ?? "" }
        : undefined,
  };
}

/** Only pieces we actually hold a rendered asset for can be shown. */
function withAssets(list: Artwork[]): Artwork[] {
  return list.filter((a) => Boolean(IMAGES[a.id]));
}

/**
 * The catalogue.
 *
 * Reads Supabase when it is configured and populated, and falls back to the
 * committed catalogue otherwise — an unreachable database degrades to a
 * slightly stale gallery rather than an empty page.
 */
export async function getArtworks(): Promise<Artwork[]> {
  const sb = getSupabase();

  if (sb) {
    const { data, error } = await sb
      .from("artworks")
      .select("id, kind, script, reads, featured, sort_order, note_bn, note_en")
      .order("sort_order", { ascending: true });

    if (error) {
      console.warn(
        `[ghurnilipi] Supabase read failed (${error.message}); serving the committed catalogue.`,
      );
    } else if (data?.length) {
      return withAssets((data as ArtworkRow[]).map(rowToArtwork));
    }
  }

  return withAssets([...CATALOG].sort((a, b) => a.order - b.order));
}

export async function getArtwork(id: string): Promise<Artwork | undefined> {
  return (await getArtworks()).find((a) => a.id === id);
}

export async function getFeatured(kind?: ArtworkKind): Promise<Artwork[]> {
  const all = await getArtworks();
  return all.filter((a) => a.featured && (!kind || a.kind === kind));
}

export async function getByKind(kind: ArtworkKind): Promise<Artwork[]> {
  return (await getArtworks()).filter((a) => a.kind === kind);
}

/** Counts per facet, for the gallery filter chips. */
export function facetCounts(list: Artwork[]) {
  const kinds: Record<ArtworkKind, number> = { couple: 0, single: 0, word: 0 };
  const scripts: Record<ScriptKind, number> = { bangla: 0, latin: 0 };
  for (const a of list) {
    kinds[a.kind] += 1;
    scripts[a.script] += 1;
  }
  return { kinds, scripts, total: list.length };
}
