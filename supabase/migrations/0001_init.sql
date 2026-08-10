-- ghurnilipi — initial schema
--
-- Run against a fresh Supabase project:
--   supabase db push
-- or paste into the SQL editor at
--   app.supabase.com > your project > SQL Editor
--
-- Two tables only. The catalogue, which the public may read, and commission
-- requests, which the public may only insert. No user accounts in v1
-- (requirements §6), so there is no profiles table and no auth surface.

create extension if not exists "pgcrypto";

-- ── artworks ───────────────────────────────────────────────────────────────
-- Mirrors src/data/catalog.ts. The site falls back to that file when this
-- table is empty, so seeding is optional until the catalogue outgrows a commit.

create type artwork_kind as enum ('couple', 'single', 'word');
create type script_kind as enum ('bangla', 'latin');

create table public.artworks (
  -- matches the asset slug in public/artwork and src/data/media-manifest.json
  id           text primary key,
  kind         artwork_kind not null,
  script       script_kind  not null default 'bangla',
  -- [{bn, en}] — one entry for a single name or word, two for a couple's piece
  reads        jsonb        not null,
  featured     boolean      not null default false,
  sort_order   integer      not null default 999,
  note_bn      text,
  note_en      text,
  created_at   timestamptz  not null default now(),

  constraint reads_is_array check (jsonb_typeof(reads) = 'array'),
  constraint reads_not_empty check (jsonb_array_length(reads) between 1 and 2),
  -- a couple's piece must carry both names; anything else carries exactly one
  constraint reads_matches_kind check (
    (kind = 'couple' and jsonb_array_length(reads) = 2)
    or (kind <> 'couple' and jsonb_array_length(reads) = 1)
  )
);

create index artworks_listing_idx on public.artworks (sort_order, id);
create index artworks_featured_idx on public.artworks (featured) where featured;

alter table public.artworks enable row level security;

-- The catalogue is public. Writes go through the Supabase dashboard or a
-- service-role key, never through the anon key the browser holds.
create policy "artworks are world readable"
  on public.artworks for select
  using (true);

-- ── commissions ────────────────────────────────────────────────────────────
-- The highest-value table on the site (requirements §4.3).

create type commission_status as enum (
  'new',          -- submitted, nobody has looked yet
  'reviewing',    -- checking whether the name pair is achievable
  'quoted',       -- price sent, waiting on the customer
  'declined',     -- not achievable, or customer walked away
  'deposit_paid', -- cleared to start
  'drawing',
  'proof_sent',
  'approved',
  'in_production',
  'shipped',
  'delivered'
);

create type contact_channel as enum ('whatsapp', 'messenger', 'phone', 'email');
create type script_preference as enum ('bangla', 'latin', 'both');

create table public.commissions (
  id            uuid primary key default gen_random_uuid(),
  -- short human reference to quote over Messenger, e.g. GH-7QK4M2
  reference     text unique not null,

  name_one_bn   text not null,
  name_one_en   text not null,
  name_two_bn   text not null default '',
  name_two_en   text not null default '',

  script_preference script_preference not null default 'bangla',
  product       text not null,
  size          text not null default '',
  occasion      text not null default '',
  -- free text on purpose: "before Eid" is a real answer and a date input
  -- would force people to invent a day they do not mean
  deadline      text not null default '',
  notes         text not null default '',

  contact_name  text not null,
  phone         text not null,
  email         text not null default '',
  preferred_channel contact_channel not null default 'whatsapp',

  status        commission_status not null default 'new',
  -- set by whoever works the queue; never written from the browser
  internal_note text not null default '',
  quoted_bdt    integer,
  deposit_bdt   integer,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint phone_present check (length(btrim(phone)) >= 6),
  constraint name_one_present check (
    length(btrim(name_one_bn)) > 0 or length(btrim(name_one_en)) > 0
  )
);

create index commissions_queue_idx on public.commissions (status, created_at desc);

alter table public.commissions enable row level security;

-- Anyone may file a request. Nobody may read the table back — it holds other
-- people's names and phone numbers, and there are no accounts to scope reads
-- to. Read it from the dashboard or with the service-role key.
create policy "anyone may submit a commission"
  on public.commissions for insert
  with check (true);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger commissions_touch_updated_at
  before update on public.commissions
  for each row execute function public.touch_updated_at();
