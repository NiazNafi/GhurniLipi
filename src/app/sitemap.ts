import type { MetadataRoute } from "next";

import { SITE } from "@/data/site";
import { getArtworks } from "@/lib/artworks";

/**
 * Sitemap, built from the live catalogue so new pieces appear without anyone
 * remembering to add them. Requirements §5 wants this findable for
 * "বাংলা আম্বিগ্রাম" and "bangla ambigram".
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const artworks = await getArtworks();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/gallery`, changeFrequency: "weekly", priority: 0.9 },
    // The form is the highest-value page on the site (requirements §4.3).
    { url: `${SITE.url}/commission`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/process`, changeFrequency: "monthly", priority: 0.6 },
  ];

  return [
    ...staticPages,
    ...artworks.map((artwork) => ({
      url: `${SITE.url}/gallery/${artwork.id}`,
      changeFrequency: "monthly" as const,
      priority: artwork.featured ? 0.8 : 0.6,
    })),
  ];
}
