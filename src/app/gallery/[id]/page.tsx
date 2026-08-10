import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArtworkDetail } from "@/components/ArtworkDetail";
import { CtaBand } from "@/components/CtaBand";
import { getArtworks, getMedia, widestSrc } from "@/lib/artworks";

/** See the note in src/app/page.tsx — keeps the Supabase catalogue live. */
export const revalidate = 300;

/**
 * Every piece known at build time is prerendered. `dynamicParams` is left at
 * its default of true, so a slug added to Supabase afterwards is rendered on
 * demand rather than 404ing — though it still needs its image deployed to show
 * anything, since getMedia() gates on the asset manifest.
 */
export async function generateStaticParams() {
  const artworks = await getArtworks();
  return artworks.map((a) => ({ id: a.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/gallery/[id]">): Promise<Metadata> {
  const { id } = await params;
  const artworks = await getArtworks();
  const artwork = artworks.find((a) => a.id === id);
  if (!artwork) return {};

  const bn = artwork.reads.map((r) => r.bn).join(" · ");
  const en = artwork.reads.map((r) => r.en).join(" · ");
  const isCouple = artwork.reads.length === 2;
  const media = getMedia(artwork.id);

  const description = isCouple
    ? `${bn} — একটি লেখা, সোজা করলে ${artwork.reads[0].bn}, ঘুরালে ${artwork.reads[1].bn}। A single piece of Bangla lettering that reads ${artwork.reads[0].en} upright and ${artwork.reads[1].en} at 180°.`
    : `${bn} — সোজা আর উল্টো, দুইভাবেই একই পড়া যায়। Bangla lettering for ${en} that reads the same upright and inverted.`;

  return {
    title: `${bn} / ${en}`,
    description,
    alternates: { canonical: `/gallery/${artwork.id}` },
    openGraph: {
      title: `${bn} — ঘূর্ণিলিপি`,
      description,
      images: media ? [{ url: widestSrc(media), alt: bn }] : [],
    },
  };
}

export default async function ArtworkPage({ params }: PageProps<"/gallery/[id]">) {
  const { id } = await params;
  const artworks = await getArtworks();
  const index = artworks.findIndex((a) => a.id === id);

  if (index === -1) notFound();

  const artwork = artworks[index];
  const media = getMedia(artwork.id);
  if (!media) notFound();

  return (
    <>
      <ArtworkDetail
        artwork={artwork}
        media={media}
        prev={artworks[index - 1]}
        next={artworks[index + 1]}
      />
      <CtaBand />
    </>
  );
}
