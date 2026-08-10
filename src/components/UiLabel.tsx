"use client";

import { t, type DictKey } from "@/lib/i18n";
import { useUiStore } from "@/store/ui";

/**
 * One dictionary string, in the active language.
 *
 * Lets a server component drop a translated label inside otherwise static
 * markup without becoming a client component itself.
 */
export function UiLabel({ k }: { k: DictKey }) {
  const lang = useUiStore((s) => s.lang);
  return <>{t(k, lang)}</>;
}
