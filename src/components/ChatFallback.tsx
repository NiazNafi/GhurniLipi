"use client";

import { SITE } from "@/data/site";
import { t } from "@/lib/i18n";
import { useUiStore } from "@/store/ui";

/**
 * The escape hatch from the form.
 *
 * Requirements §4.7: a large share of small-brand commerce here happens inside
 * Messenger, and people who expect to chat will abandon a form rather than fill
 * it in. This is given real estate on purpose, not tucked into the footer.
 */
export function ChatFallback() {
  const lang = useUiStore((s) => s.lang);

  return (
    <section className="mt-16 rounded-sm border border-bone bg-mist/40 p-6 sm:p-8">
      <h2 className="font-display text-2xl text-ink" lang={lang}>
        {t("orChat", lang)}
      </h2>
      <p className="mt-2 max-w-lg leading-relaxed text-ink-soft" lang={lang}>
        {t("chatBlurb", lang)}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={`https://wa.me/${SITE.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-oxblood"
        >
          WhatsApp
        </a>
        <a
          href={SITE.messenger}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-ink/20 px-6 py-3 text-sm text-ink transition-colors hover:border-ink/50"
        >
          Messenger
        </a>
      </div>
    </section>
  );
}
