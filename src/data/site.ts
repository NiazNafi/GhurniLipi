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
  instagram: "https://instagram.com/ghurnilipi",

  /**
   * TODO(niaz): replace with the real handles before launch. Facebook and
   * WhatsApp matter more than the form here — requirements §4.7.
   */
  facebookPage: "https://facebook.com/ghurnilipi",
  messenger: "https://m.me/ghurnilipi",
  /** International format, no +, no spaces. */
  whatsapp: "8801700000000",
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
