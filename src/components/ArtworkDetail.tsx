"use client";

import Link from "next/link";

import { RotatingAmbigram } from "@/components/RotatingAmbigram";
import { PROMISE } from "@/data/site";
import type { MediaEntry } from "@/lib/artworks";
import { pick, t } from "@/lib/i18n";
import type { Artwork } from "@/lib/types";
import { useUiStore } from "@/store/ui";

interface Props {
  artwork: Artwork;
  media: MediaEntry;
  prev?: Artwork;
  next?: Artwork;
}

export function ArtworkDetail({ artwork, media, prev, next }: Props) {
  const lang = useUiStore((s) => s.lang);
  const isCouple = artwork.reads.length === 2;

  /** Pre-fills the commission form from whatever the visitor is looking at. */
  const commissionHref = `/commission?product=${
    isCouple ? "framed-pair" : artwork.kind === "word" ? "word-print" : "single"
  }&from=${artwork.id}`;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10 sm:pb-24">
      <Link
        href="/gallery"
        className="-ml-1 inline-flex items-center gap-1.5 py-2 pl-1 pr-2 text-sm text-ink-soft transition-colors hover:text-oxblood"
      >
        <svg
          viewBox="0 0 16 16"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M9.5 3.5L5 8l4.5 4.5" />
        </svg>
        {t("backToGallery", lang)}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
        {/* The piece, given the room requirement §4.4 asks for */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <RotatingAmbigram
            artwork={artwork}
            media={media}
            priority
            showReading={false}
            sizes="(min-width: 1024px) 640px, 92vw"
          />
        </div>

        <div>
          <p className="text-[11px] tracking-[0.18em] text-oxblood uppercase">
            {t(
              artwork.kind === "couple"
                ? "filterCouple"
                : artwork.kind === "word"
                  ? "filterWord"
                  : "filterSingle",
              lang,
            )}
          </p>

          <h1
            className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl"
            lang={lang}
          >
            {isCouple ? (
              <>
                <span className="block">{artwork.reads[0][lang]}</span>
                <span className="block text-ink-faint" aria-hidden>
                  ·
                </span>
                <span className="block">{artwork.reads[1][lang]}</span>
              </>
            ) : (
              artwork.reads[0][lang]
            )}
          </h1>

          {/* What it reads, stated in words — the interaction should not be the
              only way to learn what the drawing says. */}
          <dl className="mt-8 space-y-3 border-t border-bone pt-6 text-sm">
            {isCouple ? (
              <>
                <div className="flex gap-4">
                  <dt className="w-32 shrink-0 text-ink-faint">
                    {t("readsUpright", lang)}
                  </dt>
                  <dd className="font-display text-lg text-ink" lang={lang}>
                    {artwork.reads[0][lang]}
                  </dd>
                </div>
                <div className="flex gap-4">
                  <dt className="w-32 shrink-0 text-ink-faint">
                    {t("readsTurned", lang)}
                  </dt>
                  <dd className="font-display text-lg text-ink" lang={lang}>
                    {artwork.reads[1][lang]}
                  </dd>
                </div>
              </>
            ) : (
              <div className="flex gap-4">
                <dt className="w-32 shrink-0 text-ink-faint">
                  {t("readsBothWays", lang)}
                </dt>
                <dd className="font-display text-lg text-ink" lang={lang}>
                  {artwork.reads[0][lang]}
                </dd>
              </div>
            )}

            <div className="flex gap-4">
              <dt className="w-32 shrink-0 text-ink-faint">
                {t("filterScript", lang)}
              </dt>
              <dd className="text-ink">
                {t(
                  artwork.script === "bangla" ? "filterBangla" : "filterLatin",
                  lang,
                )}
              </dd>
            </div>

            <div className="flex gap-4">
              <dt className="w-32 shrink-0 text-ink-faint">
                {t("turnaroundLabel", lang)}
              </dt>
              <dd className="text-ink" lang={lang}>
                {pick(PROMISE.turnaround, lang)}
              </dd>
            </div>
          </dl>

          {artwork.note && (
            <p
              className="mt-6 border-l-2 border-terracotta pl-4 leading-relaxed text-ink-soft italic"
              lang={lang}
            >
              {pick(artwork.note, lang)}
            </p>
          )}

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={commissionHref}
              className="rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-oxblood"
            >
              {t("commissionLikeThis", lang)}
            </Link>
            <Link
              href="/process"
              className="rounded-full border border-ink/20 px-6 py-3.5 text-sm text-ink transition-colors hover:border-ink/50"
            >
              {t("navProcess", lang)}
            </Link>
          </div>
        </div>
      </div>

      {(prev || next) && (
        <nav className="mt-16 flex items-stretch justify-between gap-4 border-t border-bone pt-6">
          {prev ? (
            <Link
              href={`/gallery/${prev.id}`}
              className="group flex min-w-0 flex-col gap-1 text-left"
            >
              <span className="text-[10px] tracking-[0.14em] text-ink-faint uppercase">
                ←
              </span>
              <span
                className="truncate font-display text-lg text-ink transition-colors group-hover:text-oxblood"
                lang={lang}
              >
                {prev.reads.map((r) => r[lang]).join(" · ")}
              </span>
            </Link>
          ) : (
            <span />
          )}

          {next && (
            <Link
              href={`/gallery/${next.id}`}
              className="group flex min-w-0 flex-col items-end gap-1 text-right"
            >
              <span className="text-[10px] tracking-[0.14em] text-ink-faint uppercase">
                →
              </span>
              <span
                className="truncate font-display text-lg text-ink transition-colors group-hover:text-oxblood"
                lang={lang}
              >
                {next.reads.map((r) => r[lang]).join(" · ")}
              </span>
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
