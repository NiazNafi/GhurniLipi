"use client";

import { useEffect, useMemo, useRef } from "react";

import { ArtworkCard } from "@/components/ArtworkCard";
import { facetCounts, getMedia } from "@/lib/artworks";
import { t, type DictKey } from "@/lib/i18n";
import { toBanglaNumerals } from "@/data/site";
import type { Artwork, ArtworkKind, ScriptKind } from "@/lib/types";
import {
  useUiStore,
  type KindFilter,
  type ScriptFilter,
} from "@/store/ui";

const KINDS: { value: KindFilter; label: DictKey }[] = [
  { value: "all", label: "filterAll" },
  { value: "couple", label: "filterCouple" },
  { value: "single", label: "filterSingle" },
  { value: "word", label: "filterWord" },
];

const SCRIPTS: { value: ScriptFilter; label: DictKey }[] = [
  { value: "all", label: "filterAll" },
  { value: "bangla", label: "filterBangla" },
  { value: "latin", label: "filterLatin" },
];

const GRID_SIZES = "(min-width: 1024px) 300px, (min-width: 640px) 44vw, 88vw";

/**
 * The filterable catalogue (requirements §4.4).
 *
 * Filter state lives in the Zustand store because three separate things read
 * it — the chips, the grid, and the result count — and it is mirrored into the
 * query string so a filtered view can be sent to someone.
 */
export function GalleryBrowser({ artworks }: { artworks: Artwork[] }) {
  const lang = useUiStore((s) => s.lang);
  const kind = useUiStore((s) => s.kind);
  const script = useUiStore((s) => s.script);
  const setKind = useUiStore((s) => s.setKind);
  const setScript = useUiStore((s) => s.setScript);
  const clearFilters = useUiStore((s) => s.clearFilters);

  const readFromUrl = useRef(false);

  /**
   * The query string is read straight off `window.location` rather than through
   * `useSearchParams`.
   *
   * That hook opts a statically prerendered page into a Suspense boundary which
   * has to resolve on the client before anything inside it hydrates — and when
   * it does not resolve, the whole filter UI sits in the DOM looking fine and
   * responding to nothing. Reading location directly keeps this page fully
   * static and keeps the controls live.
   */
  useEffect(() => {
    if (readFromUrl.current) return;
    readFromUrl.current = true;

    const params = new URLSearchParams(window.location.search);
    const urlKind = params.get("type");
    const urlScript = params.get("script");

    if (urlKind && KINDS.some((k) => k.value === urlKind)) {
      setKind(urlKind as KindFilter);
    }
    if (urlScript && SCRIPTS.some((s) => s.value === urlScript)) {
      setScript(urlScript as ScriptFilter);
    }
  }, [setKind, setScript]);

  // ...and the store writes back afterwards, so a filtered view can be shared.
  // replaceState rather than router.replace: this is the same page with a
  // different query, and there is no reason to re-run the route for it.
  useEffect(() => {
    if (!readFromUrl.current) return;

    const next = new URLSearchParams();
    if (kind !== "all") next.set("type", kind);
    if (script !== "all") next.set("script", script);

    const query = next.toString();
    const target = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;

    if (target !== window.location.pathname + window.location.search) {
      window.history.replaceState(null, "", target);
    }
  }, [kind, script]);

  const counts = useMemo(() => facetCounts(artworks), [artworks]);

  const visible = useMemo(
    () =>
      artworks.filter(
        (a) =>
          (kind === "all" || a.kind === kind) &&
          (script === "all" || a.script === script),
      ),
    [artworks, kind, script],
  );

  const hasFilters = kind !== "all" || script !== "all";
  const count = lang === "bn" ? toBanglaNumerals(visible.length) : visible.length;

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 border-y border-bone/80 py-4 sm:flex-row sm:items-center sm:gap-8">
        <FilterRow
          legend={t("filterType", lang)}
          options={KINDS}
          value={kind}
          onChange={setKind}
          countFor={(v) =>
            v === "all" ? counts.total : counts.kinds[v as ArtworkKind]
          }
          lang={lang}
        />
        <FilterRow
          legend={t("filterScript", lang)}
          options={SCRIPTS}
          value={script}
          onChange={setScript}
          countFor={(v) =>
            v === "all" ? counts.total : counts.scripts[v as ScriptKind]
          }
          lang={lang}
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm text-ink-faint" lang={lang}>
          {lang === "bn"
            ? `${count}${t("resultCount", lang)}`
            : `${count}${t("resultCount", lang)}`}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-oxblood underline decoration-oxblood/30 underline-offset-4 hover:decoration-oxblood"
          >
            {t("filterClear", lang)}
          </button>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-display text-2xl text-ink" lang={lang}>
            {t("emptyTitle", lang)}
          </p>
          <p className="mt-2 text-ink-soft" lang={lang}>
            {t("emptyBody", lang)}
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 rounded-full border border-ink/20 px-6 py-3 text-sm text-ink hover:border-ink/50"
          >
            {t("filterClear", lang)}
          </button>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
          {visible.map((artwork, i) => {
            const media = getMedia(artwork.id);
            if (!media) return null;
            return (
              <li key={artwork.id}>
                <ArtworkCard
                  artwork={artwork}
                  media={media}
                  sizes={GRID_SIZES}
                  priority={i < 4}
                />
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

interface FilterRowProps<T extends string> {
  legend: string;
  options: { value: T; label: DictKey }[];
  value: T;
  onChange: (value: T) => void;
  countFor: (value: T) => number;
  lang: "bn" | "en";
}

function FilterRow<T extends string>({
  legend,
  options,
  value,
  onChange,
  countFor,
  lang,
}: FilterRowProps<T>) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 text-[10px] tracking-[0.16em] text-ink-faint uppercase">
        {legend}
      </legend>
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-0.5">
        {options.map((option) => {
          const n = countFor(option.value);
          const active = value === option.value;
          // A facet with nothing in it is shown but not offered — it tells the
          // visitor the axis exists without leading them to an empty grid.
          const empty = n === 0;

          return (
            <button
              key={option.value}
              type="button"
              disabled={empty}
              onClick={() => onChange(option.value)}
              aria-pressed={active}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[0.8rem] whitespace-nowrap transition-colors ${
                active
                  ? "border-ink bg-ink text-paper"
                  : empty
                    ? "cursor-not-allowed border-bone/70 text-ink-faint/50"
                    : "border-bone text-ink-soft hover:border-ink-faint hover:text-ink"
              }`}
            >
              {t(option.label, lang)}
              <span
                className={`ml-1.5 text-[0.7rem] ${active ? "text-paper/60" : "text-ink-faint"}`}
              >
                {lang === "bn" ? toBanglaNumerals(n) : n}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
