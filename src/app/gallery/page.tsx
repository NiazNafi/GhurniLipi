import type { Metadata } from "next";

import { CtaBand } from "@/components/CtaBand";
import { GalleryBrowser } from "@/components/GalleryBrowser";
import { SectionHeading } from "@/components/SectionHeading";
import { getArtworks } from "@/lib/artworks";

/** See the note in src/app/page.tsx — keeps the Supabase catalogue live. */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "সংগ্রহ / The collection",
  description:
    "বাংলা ঘূর্ণন-আম্বিগ্রামের সংগ্রহ — যুগলের নাম, একক নাম আর তৈরি শব্দ-প্রিন্ট। প্রতিটি লেখা ঘুরিয়ে দেখা যায়। The full collection of Bangla rotational ambigrams: couple's names, single names, and ready-made word prints.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  const artworks = await getArtworks();

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-24">
        <SectionHeading
          kicker="navGallery"
          title="galleryTitle"
          body="galleryIntro"
        />

        <GalleryBrowser artworks={artworks} />
      </div>

      <CtaBand />
    </>
  );
}
