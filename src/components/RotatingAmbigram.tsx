"use client";

import { useEffect, useId, useRef, useState } from "react";

import { ArtworkImage } from "@/components/ArtworkImage";
import type { MediaEntry } from "@/lib/artworks";
import { pick, t } from "@/lib/i18n";
import type { Artwork } from "@/lib/types";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useUiStore } from "@/store/ui";

interface Props {
  artwork: Artwork;
  media: MediaEntry;
  sizes: string;
  priority?: boolean;
  /**
   * Hero use. Turns itself once, shortly after load, so the idea lands without
   * the visitor having to guess that the picture is a control.
   */
  autoDemo?: boolean;
  /** Renders the "reading now" caption under the piece. */
  showReading?: boolean;
  className?: string;
}

/**
 * The rotation reveal — requirements §4.2.
 *
 * Click, tap, Enter or Space turns the piece 180°. A fine pointer also gets a
 * small tilt on hover, purely so the image reads as something you can operate.
 * With JavaScript dead the piece still renders upright and legible, which is
 * the state that matters inside the Facebook in-app browser.
 */
export function RotatingAmbigram({
  artwork,
  media,
  sizes,
  priority = false,
  autoDemo = false,
  showReading = true,
  className = "",
}: Props) {
  const [turned, setTurned] = useState(false);
  const [hovering, setHovering] = useState(false);
  const reduced = useReducedMotion();
  const demoed = useRef(false);

  const lang = useUiStore((s) => s.lang);
  const hasTurned = useUiStore((s) => s.hasTurned);
  const markTurned = useUiStore((s) => s.markTurned);

  const captionId = useId();

  const isCouple = artwork.reads.length === 2;
  const upright = artwork.reads[0];
  const inverted = artwork.reads[1] ?? artwork.reads[0];
  const reading = turned ? inverted : upright;

  // One unprompted turn on the hero, then it hands over.
  useEffect(() => {
    if (!autoDemo || demoed.current || reduced) return;
    demoed.current = true;
    const outbound = window.setTimeout(() => setTurned(true), 1400);
    const back = window.setTimeout(() => setTurned(false), 4200);
    return () => {
      window.clearTimeout(outbound);
      window.clearTimeout(back);
    };
  }, [autoDemo, reduced]);

  function toggle() {
    setTurned((v) => !v);
    markTurned();
  }

  // Hover tilt is an affordance, not a preview: it must not be mistaken for
  // the reveal itself, and it never fires on a touch screen.
  const idleTilt = hovering && !reduced ? 10 : 0;
  const angle = (turned ? 180 : 0) + idleTilt;

  const altText = isCouple
    ? `${pick(upright, lang)} / ${pick(inverted, lang)} — ${t("heroTitle", lang).replace(/\n/g, " ")}`
    : pick(upright, lang);

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <button
        type="button"
        onClick={toggle}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        aria-pressed={turned}
        aria-describedby={showReading ? captionId : undefined}
        className="group relative block w-full cursor-pointer touch-manipulation overflow-hidden rounded-[3px] bg-paper-raised hairline"
        style={{ aspectRatio: media.aspect }}
      >
        <span
          className="block h-full w-full will-change-transform"
          style={{
            transform: `rotate(${angle}deg)`,
            transition: reduced
              ? "none"
              : `transform ${turned || idleTilt ? "900ms" : "700ms"} var(--ease-reveal)`,
          }}
        >
          <ArtworkImage
            media={media}
            alt={altText}
            sizes={sizes}
            priority={priority}
          />
        </span>

        {/* First-time affordance. Retires itself once anything has been turned. */}
        {!hasTurned && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-3 transition-opacity duration-300 group-hover:opacity-0"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/85 px-3 py-1.5 text-[11px] leading-none font-medium tracking-wide text-paper backdrop-blur-sm">
              <RotateGlyph />
              {t("rotateHintTap", lang)}
            </span>
          </span>
        )}
      </button>

      {showReading && (
        <p
          id={captionId}
          className="flex min-h-[2.75rem] flex-col items-center gap-0.5 text-center"
        >
          <span className="text-[11px] tracking-[0.14em] text-ink-faint uppercase">
            {isCouple ? t("heroReadsNow", lang) : t("readsBothWays", lang)}
          </span>
          <span
            key={reading.bn + String(turned)}
            className="font-display text-xl text-ink sm:text-2xl"
            lang={lang}
            style={{ animation: reduced ? undefined : "none" }}
          >
            {pick(reading, lang)}
          </span>
        </p>
      )}
    </div>
  );
}

function RotateGlyph() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="12"
      height="12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M13.5 8a5.5 5.5 0 1 1-1.8-4.07" />
      <path d="M13.7 1.6v2.9h-2.9" />
    </svg>
  );
}
