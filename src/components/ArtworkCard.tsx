"use client";

import Link from "next/link";

import { ArtworkImage } from "@/components/ArtworkImage";
import type { MediaEntry } from "@/lib/artworks";
import { t } from "@/lib/i18n";
import type { Artwork } from "@/lib/types";
import { useUiStore } from "@/store/ui";

interface Props {
  artwork: Artwork;
  media: MediaEntry;
  sizes: string;
  /** Above-the-fold cards skip lazy loading. */
  priority?: boolean;
}

/**
 * Gallery tile.
 *
 * The tile itself is a link to the detail view — the rotation lives there,
 * where there is room to admire the letterforms. Hover gives a half-turn
 * preview so the grid still communicates what these pieces do.
 */
export function ArtworkCard({ artwork, media, sizes, priority = false }: Props) {
  const lang = useUiStore((s) => s.lang);
  const isCouple = artwork.reads.length === 2;

  const label = artwork.reads.map((r) => r[lang]).join(" · ");

  return (
    <Link
      href={`/gallery/${artwork.id}`}
      className="group block"
      aria-label={label}
    >
      <div
        className="relative overflow-hidden rounded-[3px] bg-paper-raised hairline"
        style={{ aspectRatio: media.aspect }}
      >
        <span className="block h-full w-full transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-180 motion-reduce:transition-none motion-reduce:group-hover:rotate-0">
          <ArtworkImage
            media={media}
            alt={label}
            sizes={sizes}
            priority={priority}
          />
        </span>
      </div>

      {/* Stacked rather than side by side: a grid cell is about 164px on a
          phone, and "Single name" next to a two-part couple's title does not
          fit there in either language. */}
      <div className="mt-3">
        <p
          className="font-display text-lg leading-snug break-words text-ink"
          lang={lang}
        >
          {isCouple ? (
            <>
              <span>{artwork.reads[0][lang]}</span>
              <span aria-hidden className="mx-1.5 text-ink-faint">
                ·
              </span>
              <span>{artwork.reads[1][lang]}</span>
            </>
          ) : (
            artwork.reads[0][lang]
          )}
        </p>
        <span className="mt-0.5 block text-[10px] tracking-[0.12em] text-ink-faint uppercase">
          {t(
            artwork.kind === "couple"
              ? "filterCouple"
              : artwork.kind === "word"
                ? "filterWord"
                : "filterSingle",
            lang,
          )}
        </span>
      </div>
    </Link>
  );
}
