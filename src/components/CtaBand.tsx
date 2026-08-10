"use client";

import Link from "next/link";

import { SITE } from "@/data/site";
import { t } from "@/lib/i18n";
import { useUiStore } from "@/store/ui";

/**
 * Closing call to action, with the chat paths given equal billing.
 *
 * A large share of small-brand commerce in Bangladesh happens inside Messenger
 * rather than on a website (requirements §4.7), so insisting on the form here
 * would quietly cost orders.
 */
export function CtaBand() {
  const lang = useUiStore((s) => s.lang);

  return (
    <section className="border-t border-bone bg-mist/40">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
        <h2
          className="font-display text-3xl leading-[var(--leading-bangla)] text-ink sm:text-4xl"
          lang={lang}
        >
          {t("singleTitle", lang)}
        </h2>
        <p
          className="mx-auto mt-4 max-w-lg leading-relaxed text-ink-soft"
          lang={lang}
        >
          {t("commissionIntro", lang)}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/commission"
            className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-oxblood"
          >
            {t("heroCta", lang)}
          </Link>
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-ink/20 px-7 py-3.5 text-sm text-ink transition-colors hover:border-ink/50"
          >
            WhatsApp
          </a>
          <a
            href={SITE.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-ink/20 px-7 py-3.5 text-sm text-ink transition-colors hover:border-ink/50"
          >
            Messenger
          </a>
        </div>

        <p className="mx-auto mt-6 max-w-md text-sm text-ink-faint" lang={lang}>
          {t("commissionHonesty", lang)}
        </p>
      </div>
    </section>
  );
}
