-- ghurnilipi — catalogue seed
--
-- GENERATED FILE. Do not edit.
-- Source: src/data/catalog.ts   Regenerate: npm run seed:sql
--
-- Safe to re-run: existing rows are updated in place, so this doubles as the
-- way to push catalogue edits from the repo to the database.

insert into public.artworks
  (id, kind, script, reads, featured, sort_order, note_bn, note_en)
values
  ('adib-rabita', 'couple', 'bangla', '[{"bn":"আদিব","en":"Adib"},{"bn":"রাবিতা","en":"Rabita"}]'::jsonb, true, 10, 'দুই প্রান্তে দুটি পাক — নকশাটি নিজেই ১৮০° ঘুরে নিজের সঙ্গে মেলে।', 'Twin spirals at opposite corners — the composition is itself symmetrical under a half turn.'),
  ('mayeesha-aaman', 'couple', 'bangla', '[{"bn":"মায়ীশা","en":"Mayeesha"},{"bn":"আমান","en":"Aaman"}]'::jsonb, true, 15, 'হোম পেজের ফ্রেম-জোড়ার ছবিটি ঠিক এই লেখাটিরই।', 'The framed-pair photograph on the home page is this very piece — the drawing and the object it becomes.'),
  ('saiara-akif', 'couple', 'bangla', '[{"bn":"সাইয়ারা","en":"Saiara"},{"bn":"আকিফ","en":"Akif"}]'::jsonb, true, 20, NULL, NULL),
  ('tahsina-soyeb', 'couple', 'bangla', '[{"bn":"তাহসিনা","en":"Tahsina"},{"bn":"সোয়েব","en":"Soyeb"}]'::jsonb, true, 30, NULL, NULL),
  ('shourov-taniya', 'couple', 'bangla', '[{"bn":"সৌরভ","en":"Shourov"},{"bn":"তানিয়া","en":"Taniya"}]'::jsonb, false, 40, NULL, NULL),
  ('musab', 'single', 'bangla', '[{"bn":"মুসআব","en":"Musab"}]'::jsonb, true, 50, 'সাদা কালিতে, কালো কাগজে।', 'Drawn in white on black — the one reversed-out piece in the collection.'),
  ('shreya', 'single', 'bangla', '[{"bn":"শ্রেয়া","en":"Shreya"}]'::jsonb, true, 60, NULL, NULL),
  ('abheri', 'single', 'bangla', '[{"bn":"আভেরি","en":"Abheri"}]'::jsonb, true, 70, NULL, NULL),
  ('minhaj', 'single', 'bangla', '[{"bn":"মিনহাজ","en":"Minhaj"}]'::jsonb, true, 80, NULL, NULL),
  ('nafis', 'single', 'bangla', '[{"bn":"নাফিস","en":"Nafis"}]'::jsonb, false, 90, NULL, NULL),
  ('towsif', 'single', 'bangla', '[{"bn":"তাওসিফ","en":"Towsif"}]'::jsonb, false, 100, NULL, NULL),
  ('tonu', 'single', 'bangla', '[{"bn":"তনু","en":"Tonu"}]'::jsonb, false, 110, NULL, NULL),
  ('jarif', 'single', 'bangla', '[{"bn":"জারিফ","en":"Jarif"}]'::jsonb, false, 120, NULL, NULL),
  ('mihan', 'single', 'bangla', '[{"bn":"মিহান","en":"Mihan"}]'::jsonb, false, 130, NULL, NULL),
  ('minhaj-alt', 'single', 'bangla', '[{"bn":"মিনহাজ","en":"Minhaj"}]'::jsonb, false, 140, 'একই নাম, দ্বিতীয় পাঠ।', 'The same name, resolved a second way.'),
  ('bangla', 'word', 'bangla', '[{"bn":"বাংলা","en":"Bangla"}]'::jsonb, true, 150, 'দুটি লাল বৃত্ত, একটি উপরে একটি নিচে — ঘোরালেও পতাকা বদলায় না।', 'Two red discs, one above and one below, so the flag reads the same either way up.'),
  ('sompriti', 'word', 'bangla', '[{"bn":"সম্প্রীতি","en":"Sompriti"}]'::jsonb, true, 160, 'সম্প্রীতি — যে শব্দের অর্থই দুই পক্ষের মিল।', 'Harmony — a word whose meaning is two sides agreeing, set as one drawing that reads two ways.'),
  ('shunnota', 'word', 'bangla', '[{"bn":"শূন্যতা","en":"Shunnota"}]'::jsonb, false, 170, NULL, NULL)
on conflict (id) do update set
  kind       = excluded.kind,
  script     = excluded.script,
  reads      = excluded.reads,
  featured   = excluded.featured,
  sort_order = excluded.sort_order,
  note_bn    = excluded.note_bn,
  note_en    = excluded.note_en;
