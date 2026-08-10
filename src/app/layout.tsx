import type { Metadata, Viewport } from "next";
import { Hind_Siliguri, Tiro_Bangla } from "next/font/google";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { StoreHydration } from "@/components/StoreHydration";
import { SITE } from "@/data/site";
import { BRAND_ICON, getMedia, widestSrc } from "@/lib/artworks";
import { PHOTO } from "@/data/catalog";

import "./globals.css";

/** Social preview: the framed pair, since it shows the trick in one still. */
const ogPhoto = getMedia(PHOTO.framedDaylight);

/**
 * Display face. Tiro Bangla is a text-quality Bengali serif with correct
 * conjunct forms and a high-contrast Latin in the same family — which matters
 * for a lettering brand where a broken matra would undercut the whole pitch
 * (requirements §5).
 */
const tiro = Tiro_Bangla({
  weight: "400",
  subsets: ["bengali", "latin"],
  variable: "--font-tiro",
  display: "swap",
});

/** UI face. Built for Bengali at small sizes, carries Latin too. */
const hind = Hind_Siliguri({
  weight: ["300", "400", "500", "600"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "ঘূর্ণিলিপি — একটি লেখা, দুটি নাম | Bangla ambigram",
    template: "%s — ঘূর্ণিলিপি",
  },
  description:
    "বাংলা অক্ষরে ঘূর্ণন-আম্বিগ্রাম। একটি লেখা সোজা করলে এক নাম, ১৮০° ঘুরালে আরেকটি — যুগলের নাম, একক নাম, তৈরি শব্দ-প্রিন্ট। Rotational ambigrams hand-drawn in Bangla script: couple's name pieces, single names, and ready-made word prints. Dhaka, Bangladesh.",
  keywords: [
    "বাংলা আম্বিগ্রাম",
    "নাম আম্বিগ্রাম",
    "ঘূর্ণিলিপি",
    "যুগলের নাম",
    "bangla ambigram",
    "bengali ambigram",
    "name ambigram",
    "couple name ambigram",
    "ambigram tattoo bangla",
    "couple gift Bangladesh",
    "wedding gift Dhaka",
  ],
  authors: [{ name: "ghurnilipi" }],
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: ["en_GB"],
    siteName: "ঘূর্ণিলিপি / ghurnilipi",
    title: "ঘূর্ণিলিপি — একটি লেখা, দুটি নাম",
    description:
      "একই লেখা সোজা করলে এক নাম, ঘুরালে আরেকটি। বাংলা অক্ষরে হাতে আঁকা ঘূর্ণন-আম্বিগ্রাম।",
    images: ogPhoto
      ? [
          {
            url: widestSrc(ogPhoto),
            width: ogPhoto.renditions.at(-1)!.width,
            height: Math.round(
              ogPhoto.renditions.at(-1)!.width / ogPhoto.aspect,
            ),
            alt: "দুটি ফ্রেমে বসানো যুগল-আম্বিগ্রাম, একটি উল্টো",
          },
        ]
      : [],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: BRAND_ICON, apple: BRAND_ICON },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f7f3ea",
  // The artwork wants room; blocking zoom on a lettering site would be cruel.
  maximumScale: 5,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="bn" className={`${tiro.variable} ${hind.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <StoreHydration />
        <SiteHeader />
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
