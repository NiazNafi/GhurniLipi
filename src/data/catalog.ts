import type { Artwork } from "@/lib/types";

/**
 * The launch catalogue — every finished piece in resources/, described.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ NIAZ — PLEASE VERIFY THE BANGLA SPELLINGS BELOW.                        │
 * │                                                                         │
 * │ The `bn` strings are transliterated from the filenames, not read off    │
 * │ the artwork — ambigram lettering is deliberately hard to read back.     │
 * │ This is a lettering brand, so a wrong matra here is worse than a bug.   │
 * │ Every one is a one-word edit in this file; nothing else references them.│
 * └─────────────────────────────────────────────────────────────────────────┘
 *
 * This array is also the seed for the Supabase `artworks` table and the
 * fallback the site renders from when Supabase is not configured.
 */
export const CATALOG: Artwork[] = [
  // ── Couple's name ambigrams — the signature line ────────────────────────
  {
    id: "adib-rabita",
    kind: "couple",
    script: "bangla",
    reads: [
      { bn: "আদিব", en: "Adib" },
      { bn: "রাবিতা", en: "Rabita" },
    ],
    featured: true,
    order: 10,
    note: {
      bn: "দুই প্রান্তে দুটি পাক — নকশাটি নিজেই ১৮০° ঘুরে নিজের সঙ্গে মেলে।",
      en: "Twin spirals at opposite corners — the composition is itself symmetrical under a half turn.",
    },
  },
  {
    id: "mayeesha-aaman",
    kind: "couple",
    script: "bangla",
    reads: [
      { bn: "মায়ীশা", en: "Mayeesha" },
      { bn: "আমান", en: "Aaman" },
    ],
    featured: true,
    order: 15,
    note: {
      bn: "হোম পেজের ফ্রেম-জোড়ার ছবিটি ঠিক এই লেখাটিরই।",
      en: "The framed-pair photograph on the home page is this very piece — the drawing and the object it becomes.",
    },
  },
  {
    id: "saiara-akif",
    kind: "couple",
    script: "bangla",
    reads: [
      { bn: "সাইয়ারা", en: "Saiara" },
      { bn: "আকিফ", en: "Akif" },
    ],
    featured: true,
    order: 20,
  },
  {
    id: "tahsina-soyeb",
    kind: "couple",
    script: "bangla",
    reads: [
      { bn: "তাহসিনা", en: "Tahsina" },
      { bn: "সোয়েব", en: "Soyeb" },
    ],
    featured: true,
    order: 30,
  },
  {
    id: "shourov-taniya",
    kind: "couple",
    script: "bangla",
    reads: [
      { bn: "সৌরভ", en: "Shourov" },
      { bn: "তানিয়া", en: "Taniya" },
    ],
    featured: false,
    order: 40,
  },

  // ── Single name ambigrams — the strongest buying trigger ────────────────
  {
    id: "musab",
    kind: "single",
    script: "bangla",
    reads: [{ bn: "মুসআব", en: "Musab" }],
    featured: true,
    order: 50,
    note: {
      bn: "সাদা কালিতে, কালো কাগজে।",
      en: "Drawn in white on black — the one reversed-out piece in the collection.",
    },
  },
  {
    id: "shreya",
    kind: "single",
    script: "bangla",
    reads: [{ bn: "শ্রেয়া", en: "Shreya" }],
    featured: true,
    order: 60,
  },
  {
    id: "abheri",
    kind: "single",
    script: "bangla",
    reads: [{ bn: "আভেরি", en: "Abheri" }],
    featured: true,
    order: 70,
  },
  {
    id: "minhaj",
    kind: "single",
    script: "bangla",
    reads: [{ bn: "মিনহাজ", en: "Minhaj" }],
    featured: true,
    order: 80,
  },
  {
    id: "nafis",
    kind: "single",
    script: "bangla",
    reads: [{ bn: "নাফিস", en: "Nafis" }],
    featured: false,
    order: 90,
  },
  {
    id: "towsif",
    kind: "single",
    script: "bangla",
    reads: [{ bn: "তাওসিফ", en: "Towsif" }],
    featured: false,
    order: 100,
  },
  {
    id: "tonu",
    kind: "single",
    script: "bangla",
    reads: [{ bn: "তনু", en: "Tonu" }],
    featured: false,
    order: 110,
  },
  {
    id: "jarif",
    kind: "single",
    script: "bangla",
    reads: [{ bn: "জারিফ", en: "Jarif" }],
    featured: false,
    order: 120,
  },
  {
    id: "mihan",
    kind: "single",
    script: "bangla",
    reads: [{ bn: "মিহান", en: "Mihan" }],
    featured: false,
    order: 130,
  },
  {
    id: "minhaj-alt",
    kind: "single",
    script: "bangla",
    reads: [{ bn: "মিনহাজ", en: "Minhaj" }],
    featured: false,
    order: 140,
    note: {
      bn: "একই নাম, দ্বিতীয় পাঠ।",
      en: "The same name, resolved a second way.",
    },
  },

  // ── Ready-made word prints — the line that sells while he sleeps ────────
  {
    id: "bangla",
    kind: "word",
    script: "bangla",
    reads: [{ bn: "বাংলা", en: "Bangla" }],
    featured: true,
    order: 150,
    note: {
      bn: "দুটি লাল বৃত্ত, একটি উপরে একটি নিচে — ঘোরালেও পতাকা বদলায় না।",
      en: "Two red discs, one above and one below, so the flag reads the same either way up.",
    },
  },
  {
    id: "sompriti",
    kind: "word",
    script: "bangla",
    reads: [{ bn: "সম্প্রীতি", en: "Sompriti" }],
    featured: true,
    order: 160,
    note: {
      bn: "সম্প্রীতি — যে শব্দের অর্থই দুই পক্ষের মিল।",
      en: "Harmony — a word whose meaning is two sides agreeing, set as one drawing that reads two ways.",
    },
  },
  {
    id: "shunnota",
    kind: "word",
    script: "bangla",
    reads: [{ bn: "শূন্যতা", en: "Shunnota" }],
    featured: false,
    order: 170,
  },
];

export const FEATURED_COUPLE_ID = "adib-rabita";

/** Product photography, keyed to media-manifest entries. */
export const PHOTO = {
  framedDaylight: "framed-pair-daylight",
  framedLowlight: "framed-pair-lowlight",
} as const;

export function getArtworkFromCatalog(id: string): Artwork | undefined {
  return CATALOG.find((a) => a.id === id);
}
