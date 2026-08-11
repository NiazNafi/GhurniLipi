import type { Bilingual } from "@/lib/types";

/**
 * Everything Niaz will want to edit without touching a component.
 * Contact handles, prices, turnaround promises — all here.
 */

export const SITE = {
  name: { bn: "ঘূর্ণিলিপি", en: "ghurnilipi" } satisfies Bilingual,
  tagline: {
    bn: "একটি লেখা, দুটি নাম",
    en: "One drawing, two names",
  } satisfies Bilingual,
  /** Update once the domain is registered — used for canonical + OG URLs. */
  url: "https://ghurnilipi.com",

  /**
   * ┌───────────────────────────────────────────────────────────────────────┐
   * │ CONTACT CHANNELS — every value below is still a placeholder.          │
   * │                                                                       │
   * │ These are not decoration. Requirements §4.7: for a Bangladesh         │
   * │ audience a large share of small-brand commerce happens inside         │
   * │ Messenger, and the chat buttons carry as much weight as the form.     │
   * │ Right now every one of them leads nowhere.                            │
   * │                                                                       │
   * │ `npm run supabase:check` fails while any placeholder survives, so     │
   * │ this cannot quietly reach production.                                 │
   * └───────────────────────────────────────────────────────────────────────┘
   */

  /**
   * Digits only — no +, no spaces, no dashes, and NO leading zero.
   *
   * Local 01745984130 becomes 8801745984130: drop the 0, prepend the country
   * code. wa.me rejects the local form silently, opening a "phone number
   * shared via url is invalid" page rather than a chat.
   */
  whatsapp: "8801745984130",
  /**
   * Facebook username — a Page's or a profile's, not a full URL. Drives both
   * the Messenger deep link and the Facebook link in the footer.
   *
   * Currently a personal profile. That works, but a stranger messaging a
   * personal profile lands in Message Requests, which is a folder most people
   * never open — so orders can arrive and sit unseen. A Page delivers to the
   * normal inbox, and requirements §4.7 wants one anyway.
   */
  facebookPage: "Niaznafirahman",
  /**
   * Handle without the @.
   *
   * TODO(niaz): this changes when the account is renamed to @ghurnilipi
   * (requirements §1). Instagram does not redirect an old handle — the link
   * simply breaks, and the freed name can be claimed by anyone. Update this
   * line the same day you rename, not after.
   */
  instagram: "symmetry_talks",
  /**
   * Where commission mail is read. Buyers who choose email get a mailto with
   * the whole request already written, addressed here — so this has to be an
   * inbox that is actually watched, not a forwarding address set up later.
   */
  email: "niaznafirahman@gmail.com",
} as const;

/**
 * The values above as they ship in this file. Anything still matching is
 * unconfigured — see channelsConfigured() in src/lib/channels.ts.
 */
export const CHANNEL_PLACEHOLDERS = {
  whatsapp: "8801700000000",
  facebookPage: "ghurnilipi",
  instagram: "ghurnilipi",
  email: "hello@ghurnilipi.com",
} as const;

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ PRICES ARE NOT SET YET — requirements §7 question 3.                    │
 * │                                                                         │
 * │ While `PRICES_PUBLISHED` is false the site shows "ask for a price"       │
 * │ everywhere a number would go, so it is safe to put live today without    │
 * │ quoting a figure you have not decided on. Fill in the amounts below,     │
 * │ flip the flag, and prices appear.                                       │
 * └─────────────────────────────────────────────────────────────────────────┘
 */
export const PRICES_PUBLISHED = false;

export interface ProductTier {
  id: string;
  name: Bilingual;
  blurb: Bilingual;
  /** BDT. Placeholder until PRICES_PUBLISHED is true. */
  fromBdt: number;
  /** Physical goods need a courier; files do not. Drives the checkout later. */
  physical: boolean;
}

export const PRODUCTS: ProductTier[] = [
  {
    id: "framed-pair",
    name: {
      bn: "ফ্রেম-জোড়া",
      en: "Framed pair",
    },
    blurb: {
      bn: "দুটি ফ্রেম, একটি উল্টো করে বসানো — দুই নামই একসঙ্গে পড়া যায়। মাউন্ট করা, বাঁধানো, উপহারের বাক্সে।",
      en: "Two frames, one set upside down, so both names read at once. Mounted, framed, and boxed ready to hand over.",
    },
    fromBdt: 0,
    physical: true,
  },
  {
    id: "wallet-card",
    name: {
      bn: "মানিব্যাগ কার্ড",
      en: "Wallet card",
    },
    blurb: {
      bn: "আইডি কার্ডের মাপে ছাপা। মানিব্যাগ ঘুরালেই নাম বদলে যায়।",
      en: "Printed to ID-window size. Turn the wallet and the name changes.",
    },
    fromBdt: 0,
    physical: true,
  },
  {
    id: "digital-file",
    name: {
      bn: "ডিজিটাল ফাইল",
      en: "Digital file",
    },
    blurb: {
      bn: "স্ক্রিন ও ছোট প্রিন্টের জন্য ছাপযোগ্য ফাইল। কুরিয়ার লাগে না, সঙ্গে সঙ্গে পাঠানো হয়। বড় মাপ শুধু ফ্রেমের সঙ্গে।",
      en: "A print-ready file for screens and small prints, sent as soon as it is finished. Larger sizes stay with the framed piece.",
    },
    fromBdt: 0,
    physical: false,
  },
  {
    id: "word-print",
    name: {
      bn: "তৈরি শব্দ-প্রিন্ট",
      en: "Ready-made word print",
    },
    blurb: {
      bn: "অপেক্ষা নেই, বানানোর প্রয়োজন নেই। বাংলা, সম্প্রীতি, শূন্যতা — যেটি পছন্দ।",
      en: "No wait and nothing to commission. Bangla, Sompriti, Shunnota — whichever reads to you.",
    },
    fromBdt: 0,
    physical: true,
  },
];

/**
 * Sizes offered in the intake form. Lives here rather than inside the form
 * because the commission summary sent over WhatsApp has to render the same
 * label — a message reading `size: 5x7` puts the raw form value in front of a
 * customer.
 */
export const SIZES: { value: string; label: Bilingual }[] = [
  { value: "wallet", label: { bn: "মানিব্যাগ কার্ড", en: "Wallet card" } },
  { value: "5x7", label: { bn: '৫" × ৭"', en: '5" × 7"' } },
  { value: "8x10", label: { bn: '৮" × ১০"', en: '8" × 10"' } },
  { value: "a4", label: { bn: "এ-৪", en: "A4" } },
];

/** TODO(niaz): requirements §7 question 4 — confirm before launch. */
export const PROMISE = {
  turnaround: { bn: "৫–৭ দিন", en: "5–7 days" } satisfies Bilingual,
  revisions: { bn: "দুই রাউন্ড সংশোধন", en: "Two rounds of revisions" } satisfies Bilingual,
} as const;

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** ১২৫০ from 1250 — requirements §4.5 asks for Bangla numerals. */
export function toBanglaNumerals(value: number | string): string {
  return String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

/** Formats BDT for display, in the numerals of the active language. */
export function formatTaka(amount: number, lang: "bn" | "en"): string {
  const grouped = amount.toLocaleString("en-US");
  return lang === "bn" ? `৳${toBanglaNumerals(grouped)}` : `৳${grouped}`;
}
