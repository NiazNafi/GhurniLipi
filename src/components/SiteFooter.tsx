"use client";

import Link from "next/link";

import { SITE } from "@/data/site";
import { BRAND_MARK, defaultSrc } from "@/lib/artworks";
import { CHANNELS } from "@/lib/channels";
import { t } from "@/lib/i18n";
import { useUiStore } from "@/store/ui";

export function SiteFooter() {
  const lang = useUiStore((s) => s.lang);

  return (
    <footer className="mt-24 border-t border-bone bg-paper-raised">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <img
              src={defaultSrc(BRAND_MARK)}
              width={96}
              height={96}
              alt=""
              className="h-9 w-9"
            />
            <span className="font-display text-xl text-ink">{SITE.name.bn}</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
            {t("footerBlurb", lang)}
          </p>
        </div>

        <nav className="flex flex-col gap-0.5 text-sm">
          <Link href="/gallery" className="py-2 text-ink-soft hover:text-oxblood">
            {t("navGallery", lang)}
          </Link>
          <Link
            href="/gallery?type=couple"
            className="py-2 text-ink-soft hover:text-oxblood"
          >
            {t("navCouple", lang)}
          </Link>
          <Link href="/process" className="py-2 text-ink-soft hover:text-oxblood">
            {t("navProcess", lang)}
          </Link>
          <Link href="/commission" className="py-2 text-ink-soft hover:text-oxblood">
            {t("navCommission", lang)}
          </Link>
        </nav>

        <div className="flex flex-col gap-0.5 text-sm">
          <a
            href={CHANNELS.whatsapp}
            className="py-2 text-ink-soft hover:text-oxblood"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          <a href={CHANNELS.email} className="py-2 text-ink-soft hover:text-oxblood">
            {t("fieldEmail", lang)}
          </a>
          <a
            href={CHANNELS.facebook}
            className="py-2 text-ink-soft hover:text-oxblood"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
        </div>
      </div>

      <div className="border-t border-bone/70 px-4 py-5 text-center text-xs text-ink-faint sm:px-6">
        © {new Date().getFullYear()} {SITE.name[lang]} · {t("footerRights", lang)}
      </div>
    </footer>
  );
}
