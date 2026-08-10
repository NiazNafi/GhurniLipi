"use client";

import { useCallback, useState } from "react";

import { defaultSrc, srcSetFor, type MediaEntry } from "@/lib/artworks";

interface Props {
  media: MediaEntry;
  alt: string;
  /** Matches the CSS box the image lands in, so the browser picks the right width. */
  sizes: string;
  className?: string;
  /** Hero artwork only — everything else stays lazy. */
  priority?: boolean;
}

/**
 * A plain <img> rather than next/image, deliberately.
 *
 * scripts/prepare-assets.mjs has already produced exactly the widths this site
 * uses, in webp, from colour-corrected sources. Routing them back through the
 * on-demand optimiser would re-encode finished files and add a server hop for
 * nothing. The blur placeholder from the manifest covers the load-in.
 */
export function ArtworkImage({
  media,
  alt,
  sizes,
  className = "",
  priority = false,
}: Props) {
  /**
   * "unknown" until the element exists, and unknown renders *visible*.
   *
   * A server-rendered <img> is very often finished loading before React
   * hydrates and attaches onLoad, so onLoad alone silently never fires and the
   * artwork stays at opacity 0 forever. Seeding from `complete` in a ref
   * callback covers that race, and defaulting to visible means an environment
   * that never runs this component's JS at all still shows the picture.
   */
  const [status, setStatus] = useState<"unknown" | "loading" | "loaded">(
    "unknown",
  );

  const attach = useCallback((node: HTMLImageElement | null) => {
    if (!node) return;
    setStatus(node.complete ? "loaded" : "loading");
  }, []);

  return (
    <span
      className="relative block h-full w-full overflow-hidden"
      style={{
        // The 16px placeholder, scaled up. Paints instantly, no request.
        backgroundImage: `url("${media.blurDataURL}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <img
        ref={attach}
        src={defaultSrc(media)}
        srcSet={srcSetFor(media)}
        sizes={sizes}
        alt={alt}
        width={media.width}
        height={media.height}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        onLoad={() => setStatus("loaded")}
        onError={() => setStatus("loaded")}
        className={`h-full w-full object-cover ${
          status === "loading"
            ? "opacity-0"
            : "opacity-100 transition-opacity duration-500"
        } ${className}`}
      />
    </span>
  );
}
