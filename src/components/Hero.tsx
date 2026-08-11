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
    // No overflow-hidden on this section: the wash is inset-0 so it never needs
    // clipping, and clipping is what turns a too-tight line box into a visibly
    // sliced letterform — see the --leading-bangla note in globals.css.
    <section className="relative">
      <div aria-hidden className="artwork-wash absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-4 pt-8 pb-14 sm:px-6 sm:pt-16 sm:pb-20">
        {/*
          Two different layouts, one DOM.

          On a phone this is a single column and the *artwork* comes third —
          straight after the headline, ahead of the prose and the buttons. It
          has to, because §4.1 asks for the idea to land before any scrolling,
          and measured on a 375x812 screen the artwork previously started at
          552px with 552px of text stacked above it.

          From lg up it becomes the two-column layout: words left, artwork and
          product shot right. `display: contents` lets the two groups collapse
          so their children can be ordered individually on mobile, then behave
          as normal columns again on desktop.
        */}
        <div className="flex flex-col gap-y-6 lg:grid lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-center lg:gap-10 lg:gap-x-12">
          {/* ── words ── */}
          <div className="contents lg:block">
            <p className="order-1 text-[11px] tracking-[0.22em] text-oxblood uppercase lg:order-none">
              {t("heroKicker", lang)}
            </p>

            <h1
              className="order-2 -mt-2 font-display text-[2.4rem] leading-[var(--leading-bangla)] text-ink sm:text-6xl lg:order-none lg:mt-4 lg:text-[3.5rem]"
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

            {/*
              The two names, spelled out. Hidden on mobile: the rotating piece
              already captions which name is showing, so repeating them here
              only pushed the artwork further down a screen that had none.
            */}
            <p className="order-5 hidden flex-wrap items-center gap-x-3 gap-y-1 font-display text-2xl text-oxblood lg:order-none lg:mt-6 lg:flex lg:text-3xl">
              <span lang={lang}>{first[lang]}</span>
              <span aria-hidden className="text-ink-faint">
                ·
              </span>
              <span lang={lang}>{second[lang]}</span>
            </p>

            <p
              className="order-6 max-w-md leading-relaxed text-ink-soft lg:order-none lg:mt-5"
              lang={lang}
            >
              {t("heroBody", lang)}
            </p>

            <div className="order-4 flex flex-wrap items-center gap-3 lg:order-none lg:mt-8">
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

          {/*
            ── the piece, and the object ──
            Equal widths from lg up. The photograph is the only place the thing
            being sold appears as a physical object you could hand to someone,
            so giving it a third of the space was the wrong trade — even though
            the drawing beside it is the hook.
          */}
          <div className="contents lg:grid lg:grid-cols-2 lg:items-center lg:gap-4">
            <div className="order-3 lg:order-none">
              <RotatingAmbigram
                artwork={artwork}
                media={media}
                priority
                autoDemo
                sizes="(min-width: 1024px) 350px, (min-width: 640px) 55vw, 92vw"
              />
            </div>

            <figure className="order-7 lg:order-none">
              <div
                className="overflow-hidden rounded-[3px] hairline"
                style={{ aspectRatio: framedPhoto.aspect }}
              >
                <ArtworkImage
                  media={framedPhoto}
                  alt={t("heroFramedCaption", lang)}
                  sizes="(min-width: 1024px) 350px, (min-width: 640px) 45vw, 92vw"
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
