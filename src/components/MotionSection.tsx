"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { MOTION_CLIP } from "@/lib/artworks";
import { t } from "@/lib/i18n";
import { useUiStore } from "@/store/ui";

/**
 * Slot 2 of the landing page — the wallet card turning (requirements §4.1).
 *
 * Built as a facade, not an embed. The poster frame is a 38 KB webp; the clip
 * itself is only fetched once the section is on screen and the connection looks
 * willing, or the moment the visitor asks for it. Nothing here costs a byte
 * before that.
 *
 * The clip carries no audio track at all — it was stripped in the asset
 * pipeline — so a muted loop is the intended experience rather than a degraded
 * one, and the autoplay-with-sound problem never arises.
 */
export function MotionSection() {
  const lang = useUiStore((s) => s.lang);
  const [active, setActive] = useState(false);
  const [src, setSrc] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /** Narrow rendition for narrow screens; both are under 530 KB. */
  function chooseSrc() {
    const wide = window.innerWidth >= 640;
    const pick = wide
      ? MOTION_CLIP.renditions.at(-1)
      : MOTION_CLIP.renditions[0];
    return pick!.url;
  }

  /**
   * True when we should not spend the visitor's data unasked. Save-Data is
   * honoured directly, and 2G is treated the same way — a fair assumption for
   * a chunk of the traffic this site expects.
   */
  function shouldWaitForTap() {
    const conn = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    if (!conn) return false;
    if (conn.saveData) return true;
    return conn.effectiveType === "slow-2g" || conn.effectiveType === "2g";
  }

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (shouldWaitForTap()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSrc(chooseSrc());
            setActive(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "150px 0px", threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Autoplay can still be refused; falling back to the poster keeps the
  // section legible instead of leaving a dead black rectangle.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !active) return;
    video.play().catch(() => setActive(false));
  }, [active, src]);

  function playOnDemand() {
    if (!src) setSrc(chooseSrc());
    setActive(true);
  }

  const poster = MOTION_CLIP.posters;

  return (
    <section
      ref={sectionRef}
      className="bg-ink py-16 text-paper sm:py-24"
      aria-labelledby="motion-heading"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] md:gap-16">
        {/* The clip, kept portrait on every screen — it was shot 9:16 and
            letterboxing it into a landscape frame would waste the format. */}
        <div className="mx-auto w-full max-w-[19rem] md:mx-0 md:max-w-none">
          <div
            className="relative overflow-hidden rounded-sm bg-black/40 shadow-2xl shadow-black/40"
            style={{ aspectRatio: MOTION_CLIP.aspect }}
          >
            <img
              src={poster.at(-1)!.url}
              srcSet={poster.map((p) => `${p.url} ${p.width}w`).join(", ")}
              sizes="(min-width: 640px) 400px, 300px"
              width={MOTION_CLIP.width}
              height={MOTION_CLIP.height}
              alt={t("motionTitle", lang)}
              loading="lazy"
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                active ? "opacity-0" : "opacity-100"
              }`}
            />

            {src && (
              <video
                ref={videoRef}
                src={src}
                muted
                loop
                playsInline
                preload="auto"
                // Safari on iOS needs this to keep the clip inline in the page
                // rather than throwing it into the native fullscreen player.
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                {...({ "webkit-playsinline": "true" } as any)}
                aria-label={t("motionTitle", lang)}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
                  active ? "opacity-100" : "opacity-0"
                }`}
              />
            )}

            {!active && (
              <button
                type="button"
                onClick={playOnDemand}
                className="group absolute inset-0 grid cursor-pointer place-items-center bg-gradient-to-t from-black/45 via-transparent to-transparent"
              >
                <span className="flex flex-col items-center gap-2.5">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-paper/95 text-ink shadow-lg transition-transform duration-300 group-hover:scale-105">
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                      <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="text-xs font-medium tracking-wide text-paper">
                    {t("motionPlay", lang)}
                  </span>
                </span>
              </button>
            )}

            <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-black/45 px-2 py-1 text-[10px] tracking-wide text-paper/80 backdrop-blur-sm">
              {t("motionSilent", lang)}
            </span>
          </div>
        </div>

        <div>
          <p className="text-[11px] tracking-[0.18em] text-terracotta uppercase">
            {t("motionKicker", lang)}
          </p>
          <h2
            id="motion-heading"
            className="mt-3 font-display text-3xl leading-[var(--leading-bangla)] text-paper sm:text-4xl"
            lang={lang}
          >
            {t("motionTitle", lang)}
          </h2>
          <p className="mt-5 max-w-lg leading-relaxed text-paper/70" lang={lang}>
            {t("motionBody", lang)}
          </p>

          {/* Kept beside the clip, not below it: this is the most watched and
              least commercial thing on the page (requirements §4.1). */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/commission"
              className="rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-terracotta-soft"
            >
              {t("heroCta", lang)}
            </Link>
            <Link
              href="/gallery"
              className="rounded-full border border-paper/25 px-6 py-3 text-sm text-paper/80 transition-colors hover:border-paper/60 hover:text-paper"
            >
              {t("heroSecondary", lang)}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
