import { PRODUCTS, SIZES } from "@/data/site";
import { pick, t } from "@/lib/i18n";
import type { CommissionInput, Lang } from "@/lib/types";

/**
 * Renders a commission request as a plain-text message the buyer can send.
 *
 * A reference on its own makes the buyer's first message useless to them and
 * forces a dashboard lookup before Niaz can reply — so the whole request goes
 * in the chat, and the reference is there to tie it to the stored row.
 *
 * Labels come from the same dictionary the form uses, so the buyer sees the
 * words they filled in, in the language they filled them in — except where the
 * form asks a question ("What are you after?"), which needs a statement label
 * here instead.
 */

/** WhatsApp deep links carry this in a URL; keep it comfortably short. */
const MAX_LENGTH = 1200;
const MAX_NOTES = 400;

const SCRIPT_LABEL = {
  bangla: "scriptBangla",
  latin: "scriptLatin",
  both: "scriptBoth",
} as const;

/** "আদিব / Adib" when both spellings were given, otherwise whichever exists. */
function bothSpellings(bn: string, en: string): string {
  const parts = [bn.trim(), en.trim()].filter(Boolean);
  return parts.join(" / ");
}

export function commissionMessage(
  input: CommissionInput,
  reference: string,
  lang: Lang,
): string {
  const lines: string[] = [
    t("msgTitle", lang),
    `${t("msgReference", lang)}: ${reference}`,
    "",
  ];

  /** Skips anything the buyer left blank rather than printing empty labels. */
  const add = (label: string, value: string) => {
    if (value.trim()) lines.push(`${label}: ${value.trim()}`);
  };

  add(t("fieldNameOne", lang), bothSpellings(input.nameOneBn, input.nameOneEn));
  add(t("fieldNameTwo", lang), bothSpellings(input.nameTwoBn, input.nameTwoEn));
  add(t("msgScript", lang), t(SCRIPT_LABEL[input.scriptPreference], lang));

  const product = PRODUCTS.find((p) => p.id === input.product);
  add(t("msgProduct", lang), product ? pick(product.name, lang) : input.product);

  const size = SIZES.find((s) => s.value === input.size);
  add(t("fieldSize", lang), size ? pick(size.label, lang) : input.size);

  add(t("fieldOccasion", lang), input.occasion);
  add(t("msgDeadline", lang), input.deadline);
  add(t("msgFrom", lang), input.contactName);

  if (input.notes.trim()) {
    const notes =
      input.notes.trim().length > MAX_NOTES
        ? input.notes.trim().slice(0, MAX_NOTES) + "…"
        : input.notes.trim();
    lines.push("", `${t("msgNotes", lang)}: ${notes}`);
  }

  const message = lines.join("\n");
  return message.length > MAX_LENGTH
    ? message.slice(0, MAX_LENGTH - 1) + "…"
    : message;
}
