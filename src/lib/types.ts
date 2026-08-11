/** A string that exists in both site languages. Bangla is the primary. */
export interface Bilingual {
  bn: string;
  en: string;
}

export type Lang = keyof Bilingual;

/** Which script the lettering itself is drawn in. Filter facet in the gallery. */
export type ScriptKind = "bangla" | "latin";

/** Product line. Filter facet in the gallery. Mirrors requirements §3. */
export type ArtworkKind = "couple" | "single" | "word";

export interface Artwork {
  /** Slug. Must match a key in src/data/media-manifest.json. */
  id: string;
  kind: ArtworkKind;
  script: ScriptKind;
  /**
   * What the piece reads. One entry for a single name or a word; two for a
   * couple's piece — [upright, rotated 180°].
   */
  reads: Bilingual[];
  /** Surfaced on the landing page. */
  featured: boolean;
  /** Ascending sort within the gallery. */
  order: number;
  /** Optional line of context shown in the detail view. */
  note?: Bilingual;
}

/** A commission request, as captured by the intake form (requirements §4.3). */
export interface CommissionInput {
  /** First name, as it should read upright. */
  nameOneBn: string;
  nameOneEn: string;
  /** Second name, reading at 180°. Empty for a single-name piece. */
  nameTwoBn: string;
  nameTwoEn: string;
  scriptPreference: ScriptKind | "both";
  product: string;
  size: string;
  occasion: string;
  deadline: string;
  notes: string;
  contactName: string;
  phone: string;
  email: string;
  /**
   * Where they would rather be reached — most BD buyers pick a chat app.
   * Messenger is out of the offered set for now; older rows may still hold it.
   */
  preferredChannel: "whatsapp" | "phone" | "email";
}

export type CommissionResult =
  | { ok: true; reference: string }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof CommissionInput, string>> };
