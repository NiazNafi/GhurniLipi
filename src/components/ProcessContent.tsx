"use client";

import { PRICES_PUBLISHED, PRODUCTS, PROMISE, formatTaka } from "@/data/site";
import { pick, t } from "@/lib/i18n";
import type { Bilingual } from "@/lib/types";
import { useUiStore } from "@/store/ui";

/**
 * Process / FAQ (requirements §4.8) — written to preempt the questions that
 * otherwise arrive one at a time on Messenger.
 *
 * TODO(niaz): the answers below are drafted from the requirements document, not
 * from your practice. Read them once and correct anything that is not true —
 * especially the deposit rule and the decline policy.
 */
const STEPS: { title: Bilingual; body: Bilingual }[] = [
  {
    title: { bn: "১. নামগুলো পাঠান", en: "1. Send the names" },
    body: {
      bn: "বাংলা বানানটি ঠিক করে লিখে পাঠান। ইংরেজি বানানও দিলে ভালো হয় — দুটোই কাজে লাগে।",
      en: "Send the Bangla spelling exactly as it should read, and the Latin spelling too if you have it. Both get used.",
    },
  },
  {
    title: { bn: "২. আমি দেখে জানাই", en: "2. I check whether it works" },
    body: {
      bn: "প্রতিটি অক্ষর দুইভাবে পড়তে হয়, তাই সব নামজোড়া মেলে না। না মিললে শুরুতেই বলে দিই — তখন কোনো টাকা নেওয়া হয় না।",
      en: "Every letter has to do two jobs at once, so not every pair resolves. If yours will not, I say so before any money changes hands.",
    },
  },
  {
    title: { bn: "৩. খসড়া দেখি", en: "3. You see a draft" },
    body: {
      bn: "প্রথম খসড়া পাঠাই। বানান বা গড়ন নিয়ে বলার থাকলে এখানেই বলবেন।",
      en: "I send a first drawing. Spelling or shape changes belong at this stage.",
    },
  },
  {
    title: { bn: "৪. শেষ করে পাঠাই", en: "4. It gets finished and sent" },
    body: {
      bn: "ফাইল হলে সঙ্গে সঙ্গে, ফ্রেম হলে বেঁধে কুরিয়ারে।",
      en: "Files go out as soon as they are done. Framed pieces are mounted, boxed, and couriered.",
    },
  },
];

const FAQ: { q: Bilingual; a: Bilingual }[] = [
  {
    q: { bn: "সব নাম কি হয়?", en: "Does every name work?" },
    a: {
      bn: "না। অক্ষরের গড়নের উপর নির্ভর করে। কিছু নামজোড়া যতই টানাটানি করি, পড়ার মতো হয় না — সেটা আগেই জানিয়ে দিই।",
      en: "No. It depends on the letterforms. Some pairs cannot be made legible however far they are pushed, and I would rather tell you that on day one than deliver something you have to be talked into.",
    },
  },
  {
    q: { bn: "কী কী পাওয়া যায়?", en: "What do I actually get?" },
    a: {
      bn: "ফ্রেম-জোড়া, মানিব্যাগ কার্ড, অথবা ছাপযোগ্য ডিজিটাল ফাইল। ফাইলটি স্ক্রিন আর ছোট প্রিন্টের জন্য; বড় মাপ ফ্রেমের সঙ্গেই আসে।",
      en: "A framed pair, a wallet card, or a print-ready file. The file covers screens and small prints; the larger sizes come with the framed piece.",
    },
  },
  {
    q: { bn: "টাকা কীভাবে দিতে হয়?", en: "How does payment work?" },
    a: {
      bn: "বিকাশ, নগদ বা রকেট। তৈরি শব্দ-প্রিন্টে ক্যাশ অন ডেলিভারি চলে। কিন্তু নাম দিয়ে বানানো জিনিস ফেরত এলে সেটি আর কারও কাজে লাগে না — তাই কাস্টম কাজে আগে টাকা, বা অন্তত কাগজ-ফ্রেমের খরচটুকু জমা দিতে হয়।",
      en: "bKash, Nagad, or Rocket. Cash on delivery is fine for ready-made prints. A custom piece with two names on it is worth nothing to anyone else if the delivery is refused, so those need payment up front, or at least a deposit that covers materials.",
    },
  },
  {
    q: { bn: "কুরিয়ার?", en: "Delivery?" },
    a: {
      bn: "ঢাকার ভেতরে আর বাইরে খরচ আলাদা। অর্ডার শেষ করার আগেই খরচটা দেখানো হবে।",
      en: "Inside Dhaka and outside Dhaka cost different amounts, and you will see the figure before you commit to the order.",
    },
  },
  {
    q: { bn: "গানের কথা দিয়ে হবে?", en: "Can you do song lyrics?" },
    a: {
      bn: "এখন না। গানের কথার অনুমতি নেই, তাই সেগুলো সাইটে বা বিক্রিতে রাখা হয় না।",
      en: "Not at the moment. I do not hold a licence for the lyrics, so that work stays off the site and out of the shop.",
    },
  },
];

export function ProcessContent() {
  const lang = useUiStore((s) => s.lang);

  return (
    <div className="mx-auto max-w-3xl px-4 pt-10 pb-16 sm:px-6 sm:pt-14">
      <p className="text-[11px] tracking-[0.18em] text-oxblood uppercase">
        {t("navProcess", lang)}
      </p>
      <h1
        className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl"
        lang={lang}
      >
        {t("processTitle", lang)}
      </h1>

      <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 border-y border-bone py-5 text-sm">
        <div>
          <dt className="text-[10px] tracking-[0.14em] text-ink-faint uppercase">
            {t("turnaroundLabel", lang)}
          </dt>
          <dd className="mt-1 font-display text-lg text-ink" lang={lang}>
            {pick(PROMISE.turnaround, lang)}
          </dd>
        </div>
        <div>
          <dt className="text-[10px] tracking-[0.14em] text-ink-faint uppercase">
            {t("revisionsLabel", lang)}
          </dt>
          <dd className="mt-1 font-display text-lg text-ink" lang={lang}>
            {pick(PROMISE.revisions, lang)}
          </dd>
        </div>
      </dl>

      <ol className="mt-12 space-y-8">
        {STEPS.map((step) => (
          <li key={step.title.en} className="border-l-2 border-bone pl-5">
            <h2 className="font-display text-xl text-ink" lang={lang}>
              {pick(step.title, lang)}
            </h2>
            <p className="mt-2 leading-relaxed text-ink-soft" lang={lang}>
              {pick(step.body, lang)}
            </p>
          </li>
        ))}
      </ol>

      {/* What each line costs. Shows "ask for a price" until the figures in
          src/data/site.ts are filled in and PRICES_PUBLISHED is flipped. */}
      <section className="mt-16">
        <h2 className="font-display text-2xl text-ink" lang={lang}>
          {pick({ bn: "কী কী আছে", en: "What there is" }, lang)}
        </h2>
        <ul className="mt-5 divide-y divide-bone border-y border-bone">
          {PRODUCTS.map((product) => (
            <li
              key={product.id}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg text-ink" lang={lang}>
                  {pick(product.name, lang)}
                </p>
                <p
                  className="mt-1 text-[0.85rem] leading-relaxed text-ink-soft"
                  lang={lang}
                >
                  {pick(product.blurb, lang)}
                </p>
              </div>
              <p className="shrink-0 text-sm text-oxblood" lang={lang}>
                {PRICES_PUBLISHED && product.fromBdt > 0
                  ? `${t("priceFrom", lang)} ${formatTaka(product.fromBdt, lang)}`
                  : t("askForPrice", lang)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-2xl text-ink" lang={lang}>
          {pick({ bn: "প্রশ্ন-উত্তর", en: "Questions" }, lang)}
        </h2>
        <div className="mt-5 divide-y divide-bone border-y border-bone">
          {FAQ.map((item) => (
            <details key={item.q.en} className="group py-4">
              <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-lg text-ink marker:content-none">
                <span lang={lang}>{pick(item.q, lang)}</span>
                <span
                  aria-hidden
                  className="shrink-0 text-ink-faint transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 leading-relaxed text-ink-soft" lang={lang}>
                {pick(item.a, lang)}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
