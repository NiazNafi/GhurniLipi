/**
 * Single source of truth mapping raw files in resources/ to web slugs.
 * Slugs here must match the ids used in src/data/catalog.ts.
 */

export const IMAGE_WIDTHS = [480, 960, 1600];

/** Photographs — lifestyle/product shots. Kept as photo/* output. */
export const PHOTOS = [
  {
    slug: "framed-pair-daylight",
    src: "For Hero/mayeesha_aman.jfif",
  },
  {
    slug: "framed-pair-lowlight",
    src: "For Hero/c39882fe-9bd7-4ab7-96fb-b5e86b8f3cb4.jfif",
  },
];

/** Ambigram artworks — flat lettering on a background. */
export const ARTWORKS = [
  // Couple's name ambigrams
  { slug: "adib-rabita", src: "Couple Ambigrams/adib-rabita.jpg" },
  // The framed-pair photograph in the hero is this same piece.
  { slug: "mayeesha-aaman", src: "Couple Ambigrams/mayeesha_aaman.jpg" },
  { slug: "saiara-akif", src: "Couple Ambigrams/saiara-akif.jpg" },
  { slug: "shourov-taniya", src: "Couple Ambigrams/shourov-taniya.jpg" },
  { slug: "tahsina-soyeb", src: "Couple Ambigrams/tahsina-soyeb.jpg" },

  // Single name ambigrams
  { slug: "abheri", src: "Single Ambigrams/abheri.jpg" },
  { slug: "jarif", src: "Single Ambigrams/JArif.jpg" },
  { slug: "mihan", src: "Single Ambigrams/Mihan-01.png" },
  { slug: "minhaj", src: "Single Ambigrams/Minhaj.jpg" },
  { slug: "minhaj-alt", src: "Single Ambigrams/Minhaj-2.jpg" },
  { slug: "musab", src: "Single Ambigrams/Musab.jpg" },
  { slug: "nafis", src: "Single Ambigrams/Nafis.jpg" },
  { slug: "shreya", src: "Single Ambigrams/shreya.jpg" },
  { slug: "tonu", src: "Single Ambigrams/tonu.jpg" },
  { slug: "towsif", src: "Single Ambigrams/towsif.jpg" },

  // Ready-made word prints
  { slug: "bangla", src: "Single Ambigrams/bangla.jpg" },
  { slug: "shunnota", src: "Single Ambigrams/shunnota.jpg" },
  { slug: "sompriti", src: "Single Ambigrams/sompriti.jpg" },
];

/** The 3s wallet-insert rotation reveal — slot 2 of the landing page. */
export const MOTION = {
  slug: "wallet-reveal",
  src: "For Hero/9536f6c0-ed10-41ec-96aa-3fd4dc740e2b.mp4",
  posterAtSeconds: 0.06,
  widths: [480, 720],
};

/**
 * The ghurnilipi roundel is drawn into the corner of adib-rabita.jpg.
 * Lifted once, keyed to alpha, and reused as the site logo.
 */
export const LOGOMARK = {
  src: "Couple Ambigrams/adib-rabita.jpg",
  // bounding box of the dark ink, detected by luminance threshold
  extract: { left: 4033, top: 4076, width: 354, height: 354 },
  sizes: [96, 192, 384],
};
