/**
 * Turns resources/ into web-ready assets in public/.
 *
 * Run once after adding artwork:  npm run assets
 *
 * Why this exists rather than letting next/image do it at request time:
 * the sources are CMYK, .jfif, and up to 16000px wide. They need colour
 * conversion and a hard size ceiling before they go anywhere near a
 * Bangladeshi mobile connection. The emitted manifest also carries a
 * blur placeholder per image so nothing pops in.
 */

import { execFile } from "node:child_process";
import { mkdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

import {
  ARTWORKS,
  IMAGE_WIDTHS,
  LOGOMARK,
  MOTION,
  PHOTOS,
} from "./assets.config.mjs";

const execFileAsync = promisify(execFile);

const ROOT = path.resolve(import.meta.dirname, "..");
const RESOURCES = path.join(ROOT, "resources");
const PUBLIC = path.join(ROOT, "public");
const OUT_ART = path.join(PUBLIC, "artwork");
const OUT_PHOTO = path.join(PUBLIC, "photo");
const OUT_MEDIA = path.join(PUBLIC, "media");
const OUT_BRAND = path.join(PUBLIC, "brand");
const MANIFEST = path.join(ROOT, "src", "data", "media-manifest.json");

sharp.cache(false);
// Mihan-01.png is 16000x9000; sharp refuses oversized input without this.
const LIMIT = { limitInputPixels: 400_000_000 };

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;

/**
 * Path relative to public/, always with forward slashes — these strings become
 * Supabase Storage object keys, where a Windows backslash is a literal
 * character in the name rather than a separator.
 */
const rel = (abs) => path.relative(PUBLIC, abs).split(path.sep).join("/");

async function fileSize(p) {
  try {
    return (await stat(p)).size;
  } catch {
    return 0;
  }
}

/** 16px webp, inlined as a base64 data URI for next/image blurDataURL. */
async function blurPlaceholder(input) {
  const buf = await sharp(input, LIMIT)
    .resize(16, 16, { fit: "inside" })
    .webp({ quality: 45 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

/**
 * Emits one webp per width, skipping widths that would upscale.
 * Returns the manifest entry.
 */
async function processImage({ slug, src }, outDir, urlPrefix, opts = {}) {
  const input = path.join(RESOURCES, src);
  const pipeline = sharp(input, LIMIT).withMetadata({ density: undefined });
  const meta = await pipeline.metadata();

  const widths = (opts.widths ?? IMAGE_WIDTHS).filter(
    (w, i, arr) => w <= meta.width || i === 0 || arr[i - 1] < meta.width,
  );

  const emitted = [];
  for (const width of widths) {
    const outPath = path.join(outDir, `${slug}-${width}.webp`);
    await sharp(input, LIMIT)
      // toColourspace srgb handles the CMYK sources correctly
      .toColourspace("srgb")
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: opts.quality ?? 82, effort: 5 })
      .toFile(outPath);
    emitted.push({ width, bytes: await fileSize(outPath) });
  }

  const largest = emitted.at(-1);
  console.log(
    `  ${slug.padEnd(22)} ${meta.width}x${meta.height} ${String(meta.space).padEnd(5)} -> ${emitted.length} webp, largest ${kb(largest.bytes)}`,
  );

  return {
    slug,
    /**
     * Every asset URL in this manifest is explicit rather than assembled from a
     * pattern, because scripts/upload-assets.mjs rewrites each one to a
     * content-hashed Supabase Storage URL. That makes this field the single
     * place that knows where the bytes actually live.
     */
    renditions: emitted.map((e) => ({
      width: e.width,
      url: `${urlPrefix}/${slug}-${e.width}.webp`,
      file: rel(path.join(outDir, `${slug}-${e.width}.webp`)),
    })),
    width: meta.width,
    height: meta.height,
    aspect: +(meta.width / meta.height).toFixed(4),
    blurDataURL: await blurPlaceholder(input),
  };
}

/** Lifts the roundel out of the artwork corner and keys the paper to alpha. */
async function processLogomark() {
  const input = path.join(RESOURCES, LOGOMARK.src);

  const flat = await sharp(input, LIMIT)
    .toColourspace("srgb")
    .extract(LOGOMARK.extract)
    .resize({ width: 384 })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // The mark is near-black ink on near-white paper. Map luminance to alpha so
  // the mark can sit on cream or ink backgrounds without a visible plate.
  const { data, info } = flat;
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, o = 0; i < data.length; i += info.channels, o += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    // paper ~244, ink ~30. Anything above `paper` is fully transparent.
    const paper = 226;
    const ink = 60;
    const alpha = Math.round(
      255 * Math.min(1, Math.max(0, (paper - lum) / (paper - ink))),
    );
    out[o] = 26;
    out[o + 1] = 26;
    out[o + 2] = 26;
    out[o + 3] = alpha;
  }

  const keyed = sharp(out, {
    raw: { width: info.width, height: info.height, channels: 4 },
  });

  const marks = [];
  for (const size of LOGOMARK.sizes) {
    const outPath = path.join(OUT_BRAND, `mark-${size}.png`);
    await keyed
      .clone()
      .resize({ width: size })
      .png({ compressionLevel: 9, palette: true })
      .toFile(outPath);
    marks.push({
      width: size,
      url: `/brand/mark-${size}.png`,
      file: rel(outPath),
    });
    console.log(`  mark-${size}.png`.padEnd(24) + kb(await fileSize(outPath)));
  }

  // Favicon + PWA icon, on the brand cream so it reads in a browser tab.
  const icoPath = path.join(PUBLIC, "icon.png");
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: "#f7f3ea",
    },
  })
    .composite([
      {
        input: await keyed.clone().resize({ width: 400 }).png().toBuffer(),
        gravity: "center",
      },
    ])
    .png()
    .toFile(icoPath);
  console.log(`  icon.png`.padEnd(24) + kb(await fileSize(icoPath)));

  return {
    marks,
    icon: { url: "/icon.png", file: rel(icoPath) },
  };
}

/**
 * Re-encodes the wallet clip small enough to autoplay on mobile data and
 * strips the audio track — the section is a silent loop by design, and the
 * original only carries incidental room noise.
 */
async function processMotion() {
  const input = path.join(RESOURCES, MOTION.src);
  const renditions = [];

  for (const width of MOTION.widths) {
    const mp4 = path.join(OUT_MEDIA, `${MOTION.slug}-${width}.mp4`);
    await execFileAsync(ffmpegPath, [
      "-y",
      "-hide_banner",
      "-loglevel",
      "error",
      "-i",
      input,
      "-an",
      "-vf",
      `scale=${width}:-2`,
      "-c:v",
      "libx264",
      "-profile:v",
      "main",
      "-preset",
      "slow",
      "-crf",
      "30",
      "-pix_fmt",
      "yuv420p",
      // faststart so the first frame decodes before the file finishes loading
      "-movflags",
      "+faststart",
      mp4,
    ]);

    // No VP9 sibling: measured against this footage, libvpx-vp9 came out
    // ~50% *larger* than x264 at matched quality, and h264 plays everywhere
    // that matters here — including the Facebook in-app browser.
    renditions.push({
      width,
      url: `/media/${MOTION.slug}-${width}.mp4`,
      file: rel(mp4),
    });
    console.log(
      `  ${MOTION.slug}-${width}`.padEnd(24) + `mp4 ${kb(await fileSize(mp4))}`,
    );
  }

  // Poster frame, so the section paints before any video byte is fetched.
  const rawPoster = path.join(OUT_MEDIA, `${MOTION.slug}-poster-raw.png`);
  await execFileAsync(ffmpegPath, [
    "-y",
    "-hide_banner",
    "-loglevel",
    "error",
    "-ss",
    String(MOTION.posterAtSeconds),
    "-i",
    input,
    "-frames:v",
    "1",
    rawPoster,
  ]);

  const posters = [];
  for (const width of MOTION.widths) {
    const outPath = path.join(OUT_MEDIA, `${MOTION.slug}-poster-${width}.webp`);
    await sharp(rawPoster)
      .resize({ width })
      .webp({ quality: 80 })
      .toFile(outPath);
    posters.push({
      width,
      url: `/media/${MOTION.slug}-poster-${width}.webp`,
      file: rel(outPath),
    });
  }
  const blurDataURL = await blurPlaceholder(rawPoster);
  const posterMeta = await sharp(rawPoster).metadata();
  await rm(rawPoster, { force: true });
  console.log(`  poster`.padEnd(24) + `${posters.length} webp`);

  return {
    slug: MOTION.slug,
    renditions,
    posters,
    width: posterMeta.width,
    height: posterMeta.height,
    aspect: +(posterMeta.width / posterMeta.height).toFixed(4),
    blurDataURL,
  };
}

async function main() {
  for (const dir of [OUT_ART, OUT_PHOTO, OUT_MEDIA, OUT_BRAND]) {
    await mkdir(dir, { recursive: true });
  }
  await mkdir(path.dirname(MANIFEST), { recursive: true });

  console.log("\nartwork");
  const artwork = [];
  for (const item of ARTWORKS) {
    artwork.push(await processImage(item, OUT_ART, "/artwork"));
  }

  console.log("\nphotos");
  const photos = [];
  for (const item of PHOTOS) {
    photos.push(await processImage(item, OUT_PHOTO, "/photo", { quality: 78 }));
  }

  console.log("\nbrand");
  const brand = await processLogomark();

  console.log("\nmotion");
  const motion = await processMotion();

  const byslug = (acc, e) => {
    acc[e.slug] = e;
    return acc;
  };

  const manifest = {
    generated: "run `npm run assets` to regenerate — do not edit by hand",
    /**
     * Where the bytes are served from. `npm run assets` writes "local"; running
     * `npm run assets:upload` afterwards pushes everything to Supabase Storage
     * and rewrites every url in this file to a content-hashed public URL.
     */
    storage: { provider: "local", baseUrl: "" },
    images: [...artwork, ...photos].reduce(byslug, {}),
    brand,
    motion,
  };

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log(
    `\nwrote ${path.relative(ROOT, MANIFEST)} — ${Object.keys(manifest.images).length} images + 1 motion clip\n`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
