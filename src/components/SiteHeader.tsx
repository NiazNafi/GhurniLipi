"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { SITE } from "@/data/site";
import { BRAND_MARK, defaultSrc, srcSetFor } from "@/lib/artworks";
import { LANG_LABEL, OTHER_LANG, t } from "@/lib/i18n";
import { useUiStore } from "@/store/ui";

const NAV = [
  { href: "/gallery", key: "navGallery" },
  { href: "/gallery?type=couple", key: "navCouple" },
  { href: "/process", key: "navProcess" },
] as const;

export function SiteHeader() {
  const lang = useUiStore((s) => s.lang);
  const toggleLang = useUiStore((s) => s.toggleLang);
  const menuOpen = useUiStore((s) => s.menuOpen);
  const setMenuOpen = useUiStore((s) => s.setMenuOpen);
  const pathname = usePathname();

  // A route change should never leave the sheet hanging open behind the page.
  useEffect(() => setMenuOpen(false), [pathname, setMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-bone/70 bg-paper/85 backdrop-blur-md">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-sm focus:bg-ink focus:px-3 focus:py-2 focus:text-sm focus:text-paper"
      >
        {t("skipToContent", lang)}
      </a>

      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label={SITE.name[lang]}
        >
          {/* The roundel is lifted straight out of the corner of the artwork. */}
          <img
            src={defaultSrc(BRAND_MARK)}
            srcSet={srcSetFor(BRAND_MARK)}
            sizes="32px"
            width={96}
            height={96}
            alt=""
            className="h-8 w-8"
          />
          <span className="font-display text-xl leading-[var(--leading-bangla)] text-ink sm:text-[1.4rem]">
            {SITE.name.bn}
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.9rem] text-ink-soft transition-colors hover:text-oxblood"
            >
              {t(item.key, lang)}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t("langToggleLabel", lang)}
            className="rounded-full border border-bone px-3 py-2 text-xs font-medium text-ink-soft transition-colors hover:border-ink-faint hover:text-ink"
          >
            {LANG_LABEL[OTHER_LANG[lang]]}
          </button>

          <Link
            href="/commission"
            className="hidden rounded-full bg-ink px-4 py-2 text-[0.85rem] font-medium text-paper transition-colors hover:bg-oxblood sm:inline-block"
          >
            {t("navCommission", lang)}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            className="-mr-1 p-2 md:hidden"
            aria-label={menuOpen ? t("menuClose", lang) : t("menuOpen", lang)}
          >
            <svg
              viewBox="0 0 20 20"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden
            >
              {menuOpen ? (
                <>
                  <path d="M5 5l10 10" />
                  <path d="M15 5L5 15" />
                </>
              ) : (
                <>
                  <path d="M3 6h14" />
                  <path d="M3 13h14" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="border-t border-bone/70 bg-paper px-4 pb-5 md:hidden"
        >
          <nav className="flex flex-col">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="border-b border-bone/50 py-3.5 font-display text-lg text-ink"
              >
                {t(item.key, lang)}
              </Link>
            ))}
          </nav>
          <Link
            href="/commission"
            className="mt-5 block rounded-full bg-ink py-3 text-center text-sm font-medium text-paper"
          >
            {t("navCommission", lang)}
          </Link>
        </div>
      )}
    </header>
  );
}
