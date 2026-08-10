/**
 * Regenerates supabase/migrations/0002_seed_catalog.sql from src/data/catalog.ts
 * so the database and the committed fallback can never drift.
 *
 *   npm run seed:sql
 *
 * Relies on Node's native TypeScript stripping, which works here only because
 * catalog.ts imports nothing at runtime (its single import is `import type`).
 */

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "supabase", "migrations", "0002_seed_catalog.sql");

// pathToFileURL, not a bare path — Windows drive letters read as a URL scheme
const { CATALOG } = await import(
  pathToFileURL(path.join(ROOT, "src", "data", "catalog.ts")).href
);

/** Single-quote escaping for SQL literals. */
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const qOrNull = (s) => (s ? q(s) : "NULL");

const rows = CATALOG.map(
  (a) =>
    `  (${q(a.id)}, ${q(a.kind)}, ${q(a.script)}, ${q(JSON.stringify(a.reads))}::jsonb, ` +
    `${a.featured}, ${a.order}, ${qOrNull(a.note?.bn)}, ${qOrNull(a.note?.en)})`,
).join(",\n");

const sql = `-- ghurnilipi — catalogue seed
--
-- GENERATED FILE. Do not edit.
-- Source: src/data/catalog.ts   Regenerate: npm run seed:sql
--
-- Safe to re-run: existing rows are updated in place, so this doubles as the
-- way to push catalogue edits from the repo to the database.

insert into public.artworks
  (id, kind, script, reads, featured, sort_order, note_bn, note_en)
values
${rows}
on conflict (id) do update set
  kind       = excluded.kind,
  script     = excluded.script,
  reads      = excluded.reads,
  featured   = excluded.featured,
  sort_order = excluded.sort_order,
  note_bn    = excluded.note_bn,
  note_en    = excluded.note_en;
`;

await writeFile(OUT, sql);
console.log(
  `wrote ${path.relative(ROOT, OUT)} — ${CATALOG.length} artworks`,
);
