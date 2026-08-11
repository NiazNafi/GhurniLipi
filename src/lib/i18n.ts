import type { Bilingual, Lang } from "@/lib/types";

/**
 * Bangla-first, English second (requirements §4.6).
 *
 * Flat dictionary of Bilingual values rather than a routed i18n library: the
 * site is two languages and one market, and locale-prefixed routing would cost
 * more in launch time than it returns. Bangla is the server-rendered default,
 * so that is what search engines index for the market being sold to.
 */
export const DICT = {
  // ── chrome ──────────────────────────────────────────────────────────────
  navGallery: { bn: "সংগ্রহ", en: "Gallery" },
  navCouple: { bn: "যুগল", en: "Couples" },
  navProcess: { bn: "কীভাবে হয়", en: "Process" },
  navCommission: { bn: "নাম করান", en: "Commission" },
  skipToContent: { bn: "মূল অংশে যান", en: "Skip to content" },
  langToggleLabel: { bn: "ভাষা বদলান", en: "Change language" },
  menuOpen: { bn: "মেনু", en: "Menu" },
  menuClose: { bn: "বন্ধ", en: "Close" },

  // ── hero ────────────────────────────────────────────────────────────────
  heroKicker: { bn: "ঘূর্ণিলিপি", en: "ghurnilipi" },
  heroTitle: {
    bn: "একটি লেখা।\nদুটি নাম।",
    en: "One drawing.\nTwo names.",
  },
  heroBody: {
    bn: "একই লেখা সোজা করে ধরলে এক নাম, ১৮০° ঘুরালে আরেকটি। দুই ফ্রেমে পাশাপাশি বসানো — একটি উল্টো — তাই দুজনের নামই একসঙ্গে পড়া যায়।",
    en: "The same lettering reads as one name upright and the other at a half turn. Set in two frames side by side, one inverted, so both names read at once.",
  },
  heroRotateHint: { bn: "ঘুরিয়ে দেখুন", en: "Turn it" },
  heroCta: { bn: "আপনার নাম করান", en: "Get your name drawn" },
  heroSecondary: { bn: "সংগ্রহ দেখুন", en: "See the collection" },
  heroReadsNow: { bn: "এখন পড়া যাচ্ছে", en: "Reading now" },
  heroFramedCaption: {
    bn: "ফ্রেম-জোড়া, যেভাবে পৌঁছায়",
    en: "The framed pair, as it arrives",
  },

  // ── rotation control ────────────────────────────────────────────────────
  rotateAction: { bn: "১৮০° ঘুরান", en: "Turn 180°" },
  rotateHintTap: { bn: "ছুঁয়ে ঘুরান", en: "Tap to turn" },
  rotateHintHover: { bn: "মাউস রাখলেই ঘুরবে", en: "Hover to turn" },
  upright: { bn: "সোজা", en: "Upright" },
  turned: { bn: "উল্টানো", en: "Turned" },

  // ── motion section ──────────────────────────────────────────────────────
  motionKicker: { bn: "মানিব্যাগ কার্ড", en: "The wallet card" },
  motionTitle: {
    bn: "পকেটে রাখা যায়",
    en: "Small enough to carry",
  },
  motionBody: {
    bn: "আইডি কার্ডের ঘরে ঠিক বসে। মানিব্যাগ ঘুরালেই নাম বদলে যায় — সারাদিন সঙ্গে থাকে, কেউ জিজ্ঞেস করলে দেখানোও যায়।",
    en: "Sized for the ID window. Turn the wallet and the name changes — it travels with you, and it hands itself to anyone who asks.",
  },
  motionPlay: { bn: "ঘোরানো দেখুন", en: "Watch it turn" },
  motionReplay: { bn: "আবার দেখুন", en: "Play again" },
  motionSilent: { bn: "শব্দ নেই", en: "No sound" },

  // ── single names section ────────────────────────────────────────────────
  singleKicker: { bn: "একক নাম", en: "Single names" },
  singleTitle: {
    bn: "আপনার নামটি কেমন দেখাবে?",
    en: "What would your name look like?",
  },
  singleBody: {
    bn: "একটি নাম, যা সোজা আর উল্টো — দুইভাবেই একই পড়া যায়। প্রত্যেকটি আলাদা করে আঁকা, কোনো ছাঁচ নেই।",
    en: "One name that reads the same upright and inverted. Each is drawn from scratch; there is no template underneath.",
  },

  // ── words section ───────────────────────────────────────────────────────
  wordKicker: { bn: "তৈরি শব্দ-প্রিন্ট", en: "Ready-made prints" },
  wordTitle: { bn: "অপেক্ষা ছাড়াই", en: "No wait, nothing to commission" },
  wordBody: {
    bn: "আগে থেকে আঁকা শব্দ। অর্ডার করলেই পাঠানো হয়।",
    en: "Words already drawn. Ordered today, sent today.",
  },

  // ── gallery ─────────────────────────────────────────────────────────────
  galleryTitle: { bn: "সংগ্রহ", en: "The collection" },
  galleryIntro: {
    bn: "প্রতিটি লেখা ঘুরিয়ে দেখুন। যেটি পছন্দ হয়, সেটির মতো করে আপনার নামও করানো যাবে।",
    en: "Turn any piece to see it resolve. Anything here can be drawn again with your own name.",
  },
  filterAll: { bn: "সব", en: "All" },
  filterCouple: { bn: "যুগল", en: "Couple" },
  filterSingle: { bn: "একক নাম", en: "Single name" },
  filterWord: { bn: "শব্দ", en: "Word" },
  filterScript: { bn: "লিপি", en: "Script" },
  filterType: { bn: "ধরন", en: "Type" },
  filterBangla: { bn: "বাংলা", en: "Bangla" },
  filterLatin: { bn: "ইংরেজি", en: "Latin" },
  filterClear: { bn: "ফিল্টার মুছুন", en: "Clear filters" },
  resultCount: { bn: "টি লেখা", en: " pieces" },
  emptyTitle: { bn: "এই ফিল্টারে কিছু নেই", en: "Nothing matches that" },
  emptyBody: {
    bn: "ফিল্টার সরিয়ে পুরো সংগ্রহ দেখুন।",
    en: "Clear the filters to see everything.",
  },
  readsUpright: { bn: "সোজা পড়লে", en: "Upright it reads" },
  readsTurned: { bn: "ঘুরালে পড়লে", en: "Turned it reads" },
  readsBothWays: { bn: "দুইভাবেই একই", en: "Reads the same both ways" },
  backToGallery: { bn: "সংগ্রহে ফিরুন", en: "Back to the collection" },
  commissionLikeThis: {
    bn: "এমন একটি করান",
    en: "Commission one like this",
  },

  // ── commission form ─────────────────────────────────────────────────────
  commissionTitle: { bn: "নাম করান", en: "Commission a piece" },
  commissionIntro: {
    bn: "নামগুলো লিখে পাঠান। আমি দেখে জানাবো লেখাটি সম্ভব কি না, কত সময় লাগবে আর দাম কত।",
    en: "Send me the names. I will tell you whether the pair can be drawn, how long it will take, and what it costs.",
  },
  commissionHonesty: {
    bn: "সব নামজোড়া সম্ভব হয় না। অক্ষরগুলো না মিললে আমি শুরুতেই জানিয়ে দিই — তখন কোনো টাকা নেওয়া হয় না।",
    en: "Not every pair of names can be made to work. When the letterforms will not meet, I say so before any money changes hands.",
  },
  fieldNames: { bn: "নাম", en: "The names" },
  fieldNameOne: { bn: "প্রথম নাম", en: "First name" },
  fieldNameTwo: { bn: "দ্বিতীয় নাম", en: "Second name" },
  fieldNameTwoHelp: {
    bn: "একক নামের জন্য খালি রাখুন",
    en: "Leave empty for a single-name piece",
  },
  inBangla: { bn: "বাংলায়", en: "In Bangla" },
  inLatin: { bn: "ইংরেজি বানানে", en: "In Latin letters" },
  spellingHelp: {
    bn: "যেভাবে বানান হয় ঠিক সেভাবে লিখুন — লেখাটি এই বানান ধরেই আঁকা হবে।",
    en: "Spell it exactly as it should be. The drawing is built from these spellings.",
  },
  fieldScript: { bn: "কোন লিপিতে?", en: "Which script?" },
  scriptBangla: { bn: "বাংলা", en: "Bangla" },
  scriptLatin: { bn: "ইংরেজি", en: "Latin" },
  scriptBoth: { bn: "দুটোই", en: "Both" },
  fieldProduct: { bn: "কী নেবেন?", en: "What are you after?" },
  fieldSize: { bn: "মাপ", en: "Size" },
  sizeUnsure: { bn: "জানি না, পরামর্শ দিন", en: "Not sure — advise me" },
  fieldOccasion: { bn: "উপলক্ষ", en: "Occasion" },
  occasionPlaceholder: {
    bn: "জন্মদিন, বিয়ে, বিবাহবার্ষিকী…",
    en: "Birthday, wedding, anniversary…",
  },
  fieldDeadline: { bn: "কবে লাগবে?", en: "When do you need it?" },
  deadlinePlaceholder: {
    bn: "তারিখ, বা 'ঈদের আগে'",
    en: "A date, or “before Eid”",
  },
  fieldNotes: { bn: "আর কিছু বলার আছে?", en: "Anything else?" },
  notesPlaceholder: {
    bn: "বানান নিয়ে কিছু বলার থাকলে, বা কোনো ছবির কথা…",
    en: "Notes on spelling, a reference you have in mind…",
  },
  fieldContact: { bn: "যোগাযোগ", en: "How to reach you" },
  fieldYourName: { bn: "আপনার নাম", en: "Your name" },
  fieldPhone: { bn: "মোবাইল", en: "Mobile" },
  fieldEmail: { bn: "ইমেইল", en: "Email" },
  fieldEmailOptional: { bn: "ইচ্ছা হলে", en: "Optional" },
  fieldChannel: { bn: "কোথায় কথা বলবেন?", en: "Where should I reply?" },
  channelWhatsapp: { bn: "হোয়াটসঅ্যাপ", en: "WhatsApp" },
  channelMessenger: { bn: "মেসেঞ্জার", en: "Messenger" },
  channelPhone: { bn: "ফোন", en: "Phone call" },
  channelEmail: { bn: "ইমেইল", en: "Email" },
  submit: { bn: "পাঠিয়ে দিন", en: "Send the request" },
  submitting: { bn: "পাঠানো হচ্ছে…", en: "Sending…" },
  submitDone: { bn: "পৌঁছে গেছে", en: "That reached me" },
  submitDoneBody: {
    bn: "আপনার রেফারেন্স নম্বর নিচে। কথা বলার সময় এই নম্বরটি বলবেন।",
    en: "Your reference is below. Quote it whenever we speak.",
  },
  /** What happens next, per channel the buyer chose. */
  nextWhatsapp: {
    bn: "হোয়াটসঅ্যাপে উত্তর দেব। চাইলে এখনই কথা শুরু করে রাখতে পারেন — রেফারেন্সটি লেখা থাকবে।",
    en: "I will reply on WhatsApp. You can open the thread now if you like — the reference will already be written in.",
  },
  nextMessenger: {
    bn: "মেসেঞ্জারে উত্তর দিতে হলে আগে আপনাকে একটি বার্তা পাঠাতে হবে — ফর্ম থেকে আপনার মেসেঞ্জার আইডি পাই না। নিচের বোতামে চাপ দিন, সব তথ্য কপি করা আছে।",
    en: "For Messenger you have to write first — the form gives me your phone, not your Messenger. Tap below, and paste the request in; it is already copied.",
  },
  nextPhone: {
    bn: "আপনার দেওয়া নম্বরে ফোন করব। আর কিছু করতে হবে না।",
    en: "I will call the number you gave. Nothing further needed from you.",
  },
  nextEmail: {
    bn: "আপনার ইমেইলে উত্তর পাঠাব। আর কিছু করতে হবে না।",
    en: "I will reply to your email address. Nothing further needed from you.",
  },
  openMessenger: { bn: "মেসেঞ্জারে পাঠান", en: "Send it on Messenger" },
  openWhatsapp: { bn: "হোয়াটসঅ্যাপে পাঠান", en: "Send it on WhatsApp" },
  copyReference: { bn: "সব তথ্য কপি করুন", en: "Copy the whole request" },
  copiedReference: { bn: "কপি হয়েছে", en: "Copied" },
  /** Heading of the message a buyer sends over WhatsApp or pastes into chat. */
  msgTitle: { bn: "ঘূর্ণিলিপি — কাজের অনুরোধ", en: "ghurnilipi — commission request" },
  msgReference: { bn: "রেফারেন্স", en: "Reference" },
  msgFrom: { bn: "আমি", en: "From" },
  /**
   * Statement labels for the chat message. The form's own labels are phrased as
   * questions — "কী নেবেন?" — which read as nonsense with an answer colonned
   * onto them. Only the fields whose form label is a question need one here.
   */
  msgScript: { bn: "লিপি", en: "Script" },
  msgProduct: { bn: "যা নিতে চাই", en: "Item" },
  msgDeadline: { bn: "কবে দরকার", en: "Needed by" },
  msgNotes: { bn: "নোট", en: "Notes" },
  errEmailNeeded: {
    bn: "ইমেইলে উত্তর চাইলে ইমেইল ঠিকানাটি দিন",
    en: "Please give an email address if you want the reply by email",
  },
  submitAnother: { bn: "আরেকটি পাঠান", en: "Send another" },
  orChat: { bn: "অথবা সরাসরি কথা বলুন", en: "Or just message me" },
  chatBlurb: {
    bn: "ফর্ম ভরতে ইচ্ছে না করলে মেসেঞ্জার বা হোয়াটসঅ্যাপে লিখে ফেলুন — একই কাজ হবে।",
    en: "If a form is not how you would rather do this, message me instead. It works just as well.",
  },
  required: { bn: "লাগবে", en: "Required" },
  errNameOne: { bn: "প্রথম নামটি লিখুন", en: "Please give the first name" },
  errPhone: {
    bn: "একটি মোবাইল নম্বর দিন",
    en: "Please leave a mobile number",
  },
  errContactName: { bn: "আপনার নাম লিখুন", en: "Please tell me your name" },
  errGeneric: {
    bn: "পাঠানো গেল না। একবার আবার চেষ্টা করুন, বা মেসেঞ্জারে লিখুন।",
    en: "That did not send. Try once more, or message me instead.",
  },
  errNotConfigured: {
    bn: "সাইটের ডেটাবেস এখনো যুক্ত হয়নি। এখন মেসেঞ্জার বা হোয়াটসঅ্যাপে লিখুন।",
    en: "The site database is not connected yet. Please message me on WhatsApp or Messenger for now.",
  },

  // ── process / FAQ ───────────────────────────────────────────────────────
  processTitle: { bn: "কীভাবে হয়", en: "How this works" },
  turnaroundLabel: { bn: "সময়", en: "Turnaround" },
  revisionsLabel: { bn: "সংশোধন", en: "Revisions" },

  // ── pricing ─────────────────────────────────────────────────────────────
  askForPrice: { bn: "দাম জেনে নিন", en: "Ask for a price" },
  priceFrom: { bn: "থেকে", en: "from" },

  // ── footer ──────────────────────────────────────────────────────────────
  footerBlurb: {
    bn: "ঘূর্ণিলিপি — বাংলা অক্ষরে ঘূর্ণন-আম্বিগ্রাম। ঢাকা, বাংলাদেশ।",
    en: "ghurnilipi — rotational ambigrams in Bangla lettering. Dhaka, Bangladesh.",
  },
  footerRights: { bn: "সর্বস্বত্ব সংরক্ষিত", en: "All rights reserved" },
} as const satisfies Record<string, Bilingual>;

export type DictKey = keyof typeof DICT;

/** Pulls one string in the active language. */
export function t(key: DictKey, lang: Lang): string {
  return DICT[key][lang];
}

/** Picks the active side of any Bilingual value — catalogue data included. */
export function pick(value: Bilingual | undefined, lang: Lang): string {
  return value ? value[lang] : "";
}

export const OTHER_LANG: Record<Lang, Lang> = { bn: "en", en: "bn" };

/** Label for the toggle, always written in the language it switches to. */
export const LANG_LABEL: Record<Lang, string> = { bn: "বাংলা", en: "English" };
