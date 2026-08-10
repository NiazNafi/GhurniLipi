"use client";

import { t } from "@/lib/i18n";
import { useUiStore } from "@/store/ui";

/**
 * "Not every name pair is possible" — said up front, and kindly
 * (requirements §4.8). Cheaper to say here than in a refund conversation.
 */
export function HonestyNote() {
  const lang = useUiStore((s) => s.lang);

  return (
    <p
      className="mt-6 rounded-sm border-l-2 border-terracotta bg-terracotta/8 px-4 py-3.5 text-sm leading-relaxed text-ink-soft"
      lang={lang}
    >
      {t("commissionHonesty", lang)}
    </p>
  );
}
