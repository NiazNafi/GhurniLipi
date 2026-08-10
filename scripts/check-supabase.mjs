/**
 * Verifies the Supabase connection, the schema, and — most importantly — that
 * row-level security is actually protecting customer data.
 *
 *   npm run supabase:check
 *   npm run supabase:check -- --insert    # also proves RLS blocks reads
 *
 * Exits non-zero if anything is wrong, so it is safe to trust the summary.
 */

import { readFileSync } from "node:fs";
import path from "node:path";

import { createClient } from "@supabase/supabase-js";

const ROOT = path.resolve(import.meta.dirname, "..");
const WANT_INSERT = process.argv.includes("--insert");

const pass = (m) => console.log(`  \x1b[32mok\x1b[0m    ${m}`);
const fail = (m) => console.log(`  \x1b[31mFAIL\x1b[0m  ${m}`);
const info = (m) => console.log(`        ${m}`);

let failures = 0;
const check = (ok, okMsg, failMsg) => {
  if (ok) pass(okMsg);
  else {
    fail(failMsg);
    failures += 1;
  }
  return ok;
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("\nenvironment");

if (!url || !key) {
  fail("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set");
  info("Copy .env.example to .env.local and paste your project values.");
  process.exit(1);
}
pass(`url ${url}`);

/**
 * The single most damaging mistake available here is pasting a service-role or
 * secret key into a NEXT_PUBLIC_ variable, which ships full database access to
 * every visitor's browser and silently bypasses every policy below.
 */
function keyRole(k) {
  if (k.startsWith("sb_secret_")) return "secret";
  if (k.startsWith("sb_publishable_")) return "publishable";
  const parts = k.split(".");
  if (parts.length === 3) {
    try {
      const payload = JSON.parse(
        Buffer.from(parts[1], "base64url").toString("utf8"),
      );
      return payload.role ?? "unknown-jwt";
    } catch {
      return "unreadable-jwt";
    }
  }
  return "unknown";
}

const role = keyRole(key);
if (role === "service_role" || role === "secret") {
  fail(`this is a ${role} key — it must NEVER be in a NEXT_PUBLIC_ variable`);
  info("Anyone loading the site would get full read/write on your database.");
  info("Use the anon / publishable key instead, then rotate this one.");
  process.exit(1);
}
check(
  role === "anon" || role === "publishable",
  `key role "${role}" — safe to expose to the browser`,
  `unrecognised key type "${role}"; expected an anon or publishable key`,
);

const sb = createClient(url, key, { auth: { persistSession: false } });

// ── catalogue ──────────────────────────────────────────────────────────────
console.log("\nartworks");

const { data: artworks, error: artErr } = await sb
  .from("artworks")
  .select("id, kind, script, reads, featured, sort_order")
  .order("sort_order");

if (artErr) {
  fail(`cannot read artworks: ${artErr.message}`);
  if (/does not exist/i.test(artErr.message)) {
    info("Run supabase/migrations/0001_init.sql, then 0002_seed_catalog.sql.");
  }
  failures += 1;
} else {
  check(
    artworks.length > 0,
    `${artworks.length} rows readable with the public key`,
    "table exists but is empty — run 0002_seed_catalog.sql",
  );

  if (artworks.length > 0) {
    // Every row must line up with a rendered asset, or the site drops it.
    const manifest = JSON.parse(
      readFileSync(path.join(ROOT, "src", "data", "media-manifest.json"), "utf8"),
    );
    const haveAsset = new Set(Object.keys(manifest.images));
    const orphans = artworks.filter((a) => !haveAsset.has(a.id)).map((a) => a.id);
    check(
      orphans.length === 0,
      "every row has a matching image in public/artwork",
      `no image for: ${orphans.join(", ")} — these will not appear on the site`,
    );

    const badShape = artworks.filter((a) =>
      a.kind === "couple" ? a.reads?.length !== 2 : a.reads?.length !== 1,
    );
    check(
      badShape.length === 0,
      "reads/kind shape is consistent",
      `wrong number of names: ${badShape.map((a) => a.id).join(", ")}`,
    );

    const counts = artworks.reduce((acc, a) => {
      acc[a.kind] = (acc[a.kind] ?? 0) + 1;
      return acc;
    }, {});
    info(
      `couple ${counts.couple ?? 0} · single ${counts.single ?? 0} · word ${counts.word ?? 0} · featured ${artworks.filter((a) => a.featured).length}`,
    );
  }
}

// ── commissions ────────────────────────────────────────────────────────────
console.log("\ncommissions");

const { data: leaked, error: readErr } = await sb
  .from("commissions")
  .select("reference, phone");

if (readErr) {
  // An explicit permission error is also a correct outcome.
  pass(`reads rejected outright (${readErr.message})`);
} else if (leaked.length > 0) {
  fail(`${leaked.length} rows are PUBLICLY READABLE — customer phone numbers`);
  info("Re-run 0001_init.sql; the select policy is missing or too permissive.");
  failures += 1;
} else {
  pass("no rows readable with the public key");
  info("Empty could also mean an empty table — run with --insert to be sure.");
}

if (WANT_INSERT) {
  const reference = `GH-TEST${Math.floor(Math.random() * 90 + 10)}`;
  const { error: insErr } = await sb.from("commissions").insert({
    reference,
    name_one_bn: "পরীক্ষা",
    name_one_en: "Test",
    contact_name: "connection check",
    phone: "01700000000",
    product: "framed-pair",
    notes: "Inserted by npm run supabase:check -- --insert. Safe to delete.",
  });

  check(
    !insErr,
    `insert accepted (${reference})`,
    `insert rejected: ${insErr?.message}`,
  );

  if (!insErr) {
    // Decisive: a row definitely exists now, so an empty read proves RLS.
    const { data: after, error: afterErr } = await sb
      .from("commissions")
      .select("reference");
    check(
      Boolean(afterErr) || after.length === 0,
      "the row just written is NOT readable back — RLS confirmed working",
      `RLS is NOT working: read back ${after?.length} rows`,
    );
    info(`Delete the test row in the dashboard: reference = ${reference}`);
  }
}

// ── storage ────────────────────────────────────────────────────────────────
console.log("\nstorage");

const manifest = JSON.parse(
  readFileSync(path.join(ROOT, "src", "data", "media-manifest.json"), "utf8"),
);

if (manifest.storage?.provider !== "supabase") {
  fail("media is still served from public/ — run `npm run assets:upload`");
  info(`manifest storage.provider is "${manifest.storage?.provider}"`);
  failures += 1;
} else {
  pass(`bucket "${manifest.storage.bucket}"`);

  // Fetch a few real objects rather than trusting the manifest's word for it.
  const samples = [
    Object.values(manifest.images)[0]?.renditions?.at(-1),
    manifest.brand?.marks?.at(-1),
    manifest.motion?.renditions?.at(0),
    manifest.motion?.posters?.at(0),
  ].filter(Boolean);

  /**
   * A one-byte ranged GET rather than HEAD: Supabase Storage answers HEAD
   * without a cache-control header, which made this check report a false
   * failure against objects that were in fact cached correctly.
   */
  const peek = (url) =>
    fetch(url, { headers: { Range: "bytes=0-0" } });

  let reachable = 0;
  let immutable = 0;
  for (const sample of samples) {
    try {
      const res = await peek(sample.url);
      if (res.ok) {
        reachable += 1;
        const cache = res.headers.get("cache-control") ?? "";
        if (/max-age=\d{6,}/.test(cache)) immutable += 1;
        else fail(`weak cache-control "${cache}" on ${sample.url}`);
      } else {
        fail(`${res.status} on ${sample.url}`);
      }
    } catch (err) {
      fail(`unreachable: ${sample.url} (${err.message})`);
    }
  }

  check(
    reachable === samples.length,
    `${reachable}/${samples.length} sampled objects served publicly`,
    `only ${reachable}/${samples.length} reachable — is the bucket public?`,
  );
  check(
    immutable === samples.length,
    "long cache-control set on all samples",
    `${samples.length - immutable} sample(s) missing a long max-age`,
  );

  // The masters bucket holds his original files and must not be world-readable.
  const master = `${manifest.storage.baseUrl.replace(/\/media\/?$/, "/masters/")}${"For Hero/mayeesha_aman.jfif"}`;
  try {
    const res = await peek(master);
    check(
      !res.ok,
      `masters bucket is private (${res.status} on a direct fetch)`,
      "masters bucket is PUBLIC — your original files are world-readable",
    );
  } catch {
    pass("masters bucket not publicly reachable");
  }
}

console.log(
  failures === 0
    ? "\n\x1b[32mall checks passed\x1b[0m — catalogue and media both served from Supabase\n"
    : `\n\x1b[31m${failures} check(s) failed\x1b[0m\n`,
);

process.exit(failures === 0 ? 0 : 1);
