import { CHANNEL_PLACEHOLDERS, SITE } from "@/data/site";
import { commissionMessage } from "@/lib/commission-message";
import type { CommissionInput, Lang } from "@/lib/types";

/**
 * The contact channels, in one place.
 *
 * `preferredChannel` on a commission means *where Niaz replies*, not where the
 * buyer writes. That distinction drives everything below: for phone and email
 * the buyer has already handed over what is needed and should be told to expect
 * a reply, whereas WhatsApp and Messenger are worth opening a thread on now.
 */

export type Channel = "whatsapp" | "messenger" | "phone" | "email";

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
 * WhatsApp is the one channel that accepts a prefilled message, so the buyer
 * arrives with the entire request already written rather than a bare code that
 * means nothing until someone opens the dashboard.
 */
export function whatsappWithCommission(
  input: CommissionInput,
  reference: string,
  lang: Lang,
): string {
  const text = commissionMessage(input, reference, lang);
  return `${CHANNELS.whatsapp}?text=${encodeURIComponent(text)}`;
}

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

/**
 * Whether the buyer needs to do anything after submitting.
 *
 * Messenger is the awkward one: a Facebook Page cannot open a conversation
 * with someone who has not messaged it first. So a buyer who picks Messenger
 * is unreachable until they send something — which makes that button the
 * difference between a lead and a dead end, not a convenience.
 */
export function channelNeedsBuyerToOpenThread(channel: Channel): boolean {
  return channel === "messenger";
}

/** True once every placeholder in src/data/site.ts has been replaced. */
export function channelsConfigured(): boolean {
  return unconfiguredChannels().length === 0;
}

/** Names of the fields still holding their shipped placeholder value. */
export function unconfiguredChannels(): string[] {
  return (
    Object.keys(CHANNEL_PLACEHOLDERS) as (keyof typeof CHANNEL_PLACEHOLDERS)[]
  ).filter((key) => SITE[key] === CHANNEL_PLACEHOLDERS[key]);
}
