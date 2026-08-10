"use client";

import Link from "next/link";

import { ArtworkImage } from "@/components/ArtworkImage";
import { RotatingAmbigram } from "@/components/RotatingAmbigram";
import { t } from "@/lib/i18n";
import type { MediaEntry } from "@/lib/artworks";
import type { Artwork } from "@/lib/types";
import { useUiStore } from "@/store/ui";

interface Props {
  artwork: Artwork;
  media: MediaEntry;
  framedPhoto: MediaEntry;
}

/**
 * Slot 1 — the signature couple's piece (requirements §4.1).
 *
 * Two jobs at once. The interactive piece lets the visitor perform the trick
 * themselves, and the photograph of the framed pair shows the trick standing
 * still — which is the thing that makes this sellable from a web page, since
 * both names read simultaneously in a single still frame.
 */
export function Hero({ artwork, media, framedPhoto }: Props) {
  const lang = useUiStore((s) => s.lang);
  const [first, second] = artwork.reads;

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="artwork-wash absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-14 sm:px-6 sm:pt-16 sm:pb-20">
        {/* The visual side is given the larger share — this is the hook, and
            the headline only has to name what the artwork is already doing. */}
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
          {/* ── words ── */}
          <div className="order-1">
            <p className="text-[11px] tracking-[0.22em] text-oxblood uppercase">
              {t("heroKicker", lang)}
            </p>

            <h1
              className="mt-4 font-display text-[2.6rem] leading-[1.08] text-ink sm:text-6xl lg:text-[4.1rem]"
              lang={lang}
            >
              {t("heroTitle", lang)
                .split("\n")
                .map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
            </h1>

            {/* The two names, stated plainly. Whatever the artwork is doing,
                the promise should be readable in one glance. */}
            <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-display text-2xl text-oxblood sm:text-3xl">
              <span lang={lang}>{first[lang]}</span>
              <span aria-hidden className="text-ink-faint">
                ·
              </span>
              <span lang={lang}>{second[lang]}</span>
            </p>

            <p
              className="mt-5 max-w-md leading-relaxed text-ink-soft"
              lang={lang}
            >
              {t("heroBody", lang)}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/commission"
                className="rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-oxblood"
              >
                {t("heroCta", lang)}
              </Link>
              <Link
                href="/gallery"
                className="rounded-full border border-ink/20 px-6 py-3.5 text-sm text-ink transition-colors hover:border-ink/50"
              >
                {t("heroSecondary", lang)}
              </Link>
            </div>
          </div>

          {/* ── the piece, and the object ── */}
          <div className="order-2 grid gap-4 sm:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)] sm:items-start">
            <RotatingAmbigram
              artwork={artwork}
              media={media}
              priority
              autoDemo
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 55vw, 92vw"
            />

            <figure className="mt-1 sm:mt-0">
              <div
                className="overflow-hidden rounded-[3px] hairline"
                style={{ aspectRatio: framedPhoto.aspect }}
              >
                <ArtworkImage
                  media={framedPhoto}
                  alt={t("heroFramedCaption", lang)}
                  sizes="(min-width: 1024px) 230px, (min-width: 640px) 32vw, 92vw"
                />
              </div>
              <figcaption
                className="mt-2.5 text-center text-[11px] leading-snug text-ink-faint sm:text-left"
                lang={lang}
              >
                {t("heroFramedCaption", lang)}
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
