/**
 * Moves every media file to Supabase Storage and rewrites the manifest to point
 * at it, so nothing binary ships with the site.
 *
 *   npm run assets:upload
 *
 * Two buckets:
 *   media    public  — the web renditions the site serves
 *   masters  private — the untouched originals from resources/, as an archive
 *
 * Object keys carry a short content hash, so replacing a piece produces a new
 * URL. That is what lets the files be cached for a year without ever going
 * stale, which matters more here than anywhere else — a Bangladeshi mobile
 * connection should fetch each rendition once, forever.
 *
 * Needs SUPABASE_SECRET_KEY, which bypasses row-level security. It is read from
 * the environment and deliberately NOT prefixed NEXT_PUBLIC_, so it can never
 * reach the browser bundle.
 */

import { createHash } from "node:crypto";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";

const ROOT = path.resolve(import.meta.dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const RESOURCES = path.join(ROOT, "resources");
const MANIFEST = path.join(ROOT, "src", "data", "media-manifest.json");

const PUBLIC_BUCKET = "media";
const MASTERS_BUCKET = "masters";
/** Content-hashed keys can never go stale, so cache them for a year. */
const CACHE_CONTROL = "31536000";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;

if (!url) {
  console.error("NEXT_PUBLIC_SUPABASE_URL is not set. Check .env.local.");
  process.exit(1);
}
if (!secret) {
  console.error(
    [
      "SUPABASE_SECRET_KEY is not set.",
      "",
      "Creating buckets and uploading needs a key that bypasses row-level",
      "security. Get it from the Supabase dashboard:",
      "  Settings -> API Keys -> secret / service_role  (click Reveal)",
      "",
      "Add it to .env.local as its own line:",
      "  SUPABASE_SECRET_KEY=sb_secret_...",
      "",
      "Do NOT rename it to NEXT_PUBLIC_SUPABASE_SECRET_KEY, and do not paste it",
      "into NEXT_PUBLIC_SUPABASE_ANON_KEY — anything NEXT_PUBLIC_ is shipped to",
      "every visitor's browser.",
    ].join("\n"),
  );
  process.exit(1);
}

/** Fails early on a publishable key, whose upload would be rejected anyway. */
function looksPublic(key) {
  if (key.startsWith("sb_publishable_")) return true;
  const parts = key.split(".");
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8"),
    );
    return payload.role === "anon";
  } catch {
    return false;
  }
}

if (looksPublic(secret)) {
  console.error(
    "SUPABASE_SECRET_KEY looks like a publishable/anon key. It cannot create\n" +
      "buckets or upload. Use the secret / service_role key.",
  );
  process.exit(1);
}

const sb = createClient(url, secret, { auth: { persistSession: false } });

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
const shortHash = (buf) =>
  createHash("sha256").update(buf).digest("hex").slice(0, 8);

/** Adds the content hash before the extension: a/b-960.webp -> a/b-960.1f4c9a20.webp */
function hashedKey(relPath, hash) {
  const ext = path.extname(relPath);
  return `${relPath.slice(0, -ext.length)}.${hash}${ext}`;
}

const MIME = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".jfif": "image/jpeg",
  ".mp4": "video/mp4",
};
const mimeFor = (p) => MIME[path.extname(p).toLowerCase()] ?? "application/octet-stream";

async function ensureBucket(name, isPublic) {
  const { data: existing } = await sb.storage.getBucket(name);
  if (existing) {
    // A bucket created privately by hand would 404 every image on the site.
    if (existing.public !== isPublic) {
      const { error } = await sb.storage.updateBucket(name, { public: isPublic });
      if (error) throw new Error(`updateBucket ${name}: ${error.message}`);
      console.log(`  bucket ${name} — visibility corrected to public=${isPublic}`);
    } else {
      console.log(`  bucket ${name} — exists (public=${isPublic})`);
    }
    return;
  }
  const { error } = await sb.storage.createBucket(name, { public: isPublic });
  if (error) throw new Error(`createBucket ${name}: ${error.message}`);
  console.log(`  bucket ${name} — created (public=${isPublic})`);
}

let uploaded = 0;
let bytes = 0;

/** Uploads one file, returning its object key and public URL. Idempotent. */
async function upload(bucket, absPath, relPath) {
  const body = await readFile(absPath);
  const key = hashedKey(relPath, shortHash(body));

  const { error } = await sb.storage.from(bucket).upload(key, body, {
    contentType: mimeFor(relPath),
    cacheControl: CACHE_CONTROL,
    upsert: true,
  });

  if (error) throw new Error(`${key}: ${error.message}`);

  uploaded += 1;
  bytes += body.length;

  const { data } = sb.storage.from(bucket).getPublicUrl(key);
  return { key, url: data.publicUrl };
}

/** Walks a directory tree, returning paths relative to `base`. */
async function walk(base, dir = base) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(base, abs)));
    else out.push(path.relative(base, abs).split(path.sep).join("/"));
  }
  return out;
}

/** Every object key in a bucket, recursing into folder prefixes. */
async function listAll(bucket, prefix = "") {
  const { data, error } = await sb.storage
    .from(bucket)
    .list(prefix, { limit: 1000 });
  if (error) throw new Error(`list ${bucket}/${prefix}: ${error.message}`);

  const keys = [];
  for (const item of data) {
    const key = prefix ? `${prefix}/${item.name}` : item.name;
    // Supabase reports folders as entries with a null id.
    if (item.id === null) keys.push(...(await listAll(bucket, key)));
    else keys.push(key);
  }
  return keys;
}

/**
 * Deletes objects the current manifest no longer references.
 *
 * Because keys are content-hashed, replacing a piece leaves the old rendition
 * behind forever — so without this the bucket grows every time artwork changes.
 * It is also what clears up a bad upload.
 */
async function prune(bucket, keepKeys) {
  const keep = new Set(keepKeys);
  const present = await listAll(bucket);
  const stale = present.filter((k) => !keep.has(k));

  if (stale.length === 0) {
    console.log(`  ${bucket} — nothing stale`);
    return;
  }

  // remove() caps at 1000 keys per call
  for (let i = 0; i < stale.length; i += 1000) {
    const batch = stale.slice(i, i + 1000);
    const { error } = await sb.storage.from(bucket).remove(batch);
    if (error) throw new Error(`remove from ${bucket}: ${error.message}`);
  }
  console.log(`  ${bucket} — removed ${stale.length} stale object(s)`);
}

async function main() {
  const manifest = JSON.parse(await readFile(MANIFEST, "utf8"));

  console.log("\nbuckets");
  await ensureBucket(PUBLIC_BUCKET, true);
  await ensureBucket(MASTERS_BUCKET, false);

  // ── web renditions ───────────────────────────────────────────────────────
  console.log("\nweb renditions");

  /** Every {url, file} pair in the manifest, wherever it is nested. */
  const targets = [
    ...Object.values(manifest.images).flatMap((img) => img.renditions),
    ...manifest.brand.marks,
    manifest.brand.icon,
    ...manifest.motion.renditions,
    ...manifest.motion.posters,
  ];

  const mediaKeys = [];
  for (const target of targets) {
    if (!target.file) {
      throw new Error(
        `manifest entry has no "file" — run \`npm run assets\` first:\n${JSON.stringify(target)}`,
      );
    }
    if (target.file.includes("\\")) {
      throw new Error(
        `manifest key contains a backslash, which Storage treats as a literal\n` +
          `character rather than a separator: ${target.file}\n` +
          `Re-run \`npm run assets\` to regenerate the manifest.`,
      );
    }
    const abs = path.join(PUBLIC, target.file);
    const { url, key } = await upload(PUBLIC_BUCKET, abs, target.file);
    target.url = url;
    mediaKeys.push(key);
  }
  console.log(`  ${targets.length} files, ${kb(bytes)}`);

  // ── originals ────────────────────────────────────────────────────────────
  console.log("\nmasters (private archive)");
  const before = uploaded;
  const masterBytes = bytes;
  const masterKeys = [];
  for (const relPath of await walk(RESOURCES)) {
    const { key } = await upload(
      MASTERS_BUCKET,
      path.join(RESOURCES, relPath),
      relPath,
    );
    masterKeys.push(key);
  }
  console.log(
    `  ${uploaded - before} files, ${kb(bytes - masterBytes)} — private, not served to the site`,
  );

  // ── remove anything no longer referenced ─────────────────────────────────
  console.log("\nprune");
  await prune(PUBLIC_BUCKET, mediaKeys);
  await prune(MASTERS_BUCKET, masterKeys);

  // ── rewrite the manifest ─────────────────────────────────────────────────
  const { data: probe } = sb.storage.from(PUBLIC_BUCKET).getPublicUrl("");
  manifest.storage = {
    provider: "supabase",
    bucket: PUBLIC_BUCKET,
    baseUrl: probe.publicUrl.replace(/\/$/, ""),
  };

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");

  console.log(
    `\nmanifest rewritten — every asset URL now points at Supabase Storage.` +
      `\n${uploaded} objects uploaded, ${kb(bytes)} total.` +
      `\n\nCommit src/data/media-manifest.json; public/ media is git-ignored.\n`,
  );
}

main().catch((err) => {
  console.error(`\n${err.message}\n`);
  process.exit(1);
});
