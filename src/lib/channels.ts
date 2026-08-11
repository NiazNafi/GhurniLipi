import { CHANNEL_PLACEHOLDERS, SITE } from "@/data/site";
import { commissionMessage } from "@/lib/commission-message";
import type { CommissionInput, Lang } from "@/lib/types";

/**
 * The contact channels, in one place.
 *
 * `preferredChannel` on a commission means *where Niaz replies*, not where the
 * buyer writes. Two of them can carry the request across on the spot — WhatsApp
 * in a deep link, email in a mailto — so those buyers are handed a ready
 * message rather than a bare code. Phone needs nothing further from them.
 *
 * Messenger and Instagram are dark for now: the handles resolve, but nothing in
 * the UI links to them. Messenger was the awkward one anyway — the form
 * collects a phone, not a Messenger identity, and a Page cannot open the
 * conversation itself, so the buyer had to write first.
 */

const digits = (value: string) => value.replace(/\D/g, "");

export const CHANNELS = {
  whatsapp: `https://wa.me/${digits(SITE.whatsapp)}`,
  /** m.me takes the page username or numeric id. */
  messenger: `https://m.me/${SITE.facebookPage}`,
  facebook: `https://facebook.com/${SITE.facebookPage}`,
  instagram: `https://instagram.com/${SITE.instagram}`,
  phone: `tel:+${digits(SITE.whatsapp)}`,
  email: `mailto:${SITE.email}`,
} as const;

/**
 * WhatsApp accepts a prefilled message, so the buyer arrives with the entire
 * request already written rather than a bare code that means nothing until
 * someone opens the dashboard.
 */
export function whatsappWithCommission(
  input: CommissionInput,
  reference: string,
  lang: Lang,
): string {
  const text = commissionMessage(input, reference, lang);
  return `${CHANNELS.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** The same, by mail: subject carries the reference, body carries the request. */
export function emailWithCommission(
  input: CommissionInput,
  reference: string,
  lang: Lang,
): string {
  const subject =
    lang === "bn" ? `ঘূর্ণিলিপি ${reference}` : `ghurnilipi ${reference}`;
  const body = commissionMessage(input, reference, lang);
  return `${CHANNELS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/** True once every placeholder in src/data/site.ts has been replaced. */
export function channelsConfigured(): boolean {
  return unconfiguredChannels().length === 0;
}

/**
 * Names of the fields still holding their shipped placeholder value.
 *
 * Compared as plain strings: both sides are `as const`, so once every handle is
 * real the literal types no longer overlap and TypeScript calls the comparison
 * a mistake — which would make the check fail to compile exactly when it is
 * passing. The runtime check is the point; it has to survive a future edit that
 * puts a placeholder back.
 */
export function unconfiguredChannels(): string[] {
  return (
    Object.keys(CHANNEL_PLACEHOLDERS) as (keyof typeof CHANNEL_PLACEHOLDERS)[]
  ).filter(
    (key) => (SITE[key] as string) === (CHANNEL_PLACEHOLDERS[key] as string),
  );
}
