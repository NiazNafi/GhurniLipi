"use server";

import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { CommissionInput, CommissionResult } from "@/lib/types";

/** GH-7QK4M2 — short enough to read out over Messenger. */
function makeReference(): string {
  const alphabet = "ACDEFGHJKLMNPQRTUVWXY34679";
  let body = "";
  for (let i = 0; i < 6; i += 1) {
    body += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `GH-${body}`;
}

const MAX = {
  name: 120,
  short: 200,
  long: 2000,
} as const;

function clean(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

/**
 * Files a commission request (requirements §4.3).
 *
 * Deliberately does not take payment. Pricing is still an open question and
 * custom work needs a deposit rule decided first — so this captures the request
 * and the reply happens over the channel the buyer chose.
 */
export async function submitCommission(
  input: CommissionInput,
): Promise<CommissionResult> {
  const payload = {
    name_one_bn: clean(input.nameOneBn, MAX.name),
    name_one_en: clean(input.nameOneEn, MAX.name),
    name_two_bn: clean(input.nameTwoBn, MAX.name),
    name_two_en: clean(input.nameTwoEn, MAX.name),
    script_preference: (["bangla", "latin", "both"] as const).includes(
      input.scriptPreference as "bangla",
    )
      ? input.scriptPreference
      : "bangla",
    product: clean(input.product, MAX.short),
    size: clean(input.size, MAX.short),
    occasion: clean(input.occasion, MAX.short),
    deadline: clean(input.deadline, MAX.short),
    notes: clean(input.notes, MAX.long),
    contact_name: clean(input.contactName, MAX.name),
    phone: clean(input.phone, MAX.short),
    email: clean(input.email, MAX.short),
    preferred_channel: (
      ["whatsapp", "messenger", "phone", "email"] as const
    ).includes(input.preferredChannel as "whatsapp")
      ? input.preferredChannel
      : "whatsapp",
  };

  // Server-side validation, mirroring the client's. The client's copy is for
  // speed; this one is the one that counts. Values are dictionary keys, which
  // the form renders in whichever language the visitor is reading.
  const fieldErrors: Partial<Record<keyof CommissionInput, string>> = {};

  if (!payload.name_one_bn && !payload.name_one_en) {
    fieldErrors.nameOneBn = "errNameOne";
  }
  if (payload.phone.replace(/\D/g, "").length < 6) {
    fieldErrors.phone = "errPhone";
  }
  if (!payload.contact_name) {
    fieldErrors.contactName = "errContactName";
  }
  // Asking to be answered by email without leaving one makes the request
  // unreplyable, so it is refused rather than stored as a dead lead.
  if (payload.preferred_channel === "email" && !payload.email) {
    fieldErrors.email = "errEmailNeeded";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "errGeneric", fieldErrors };
  }

  if (!isSupabaseConfigured) {
    console.warn(
      "[ghurnilipi] Commission received but Supabase is not configured — nothing was stored.\n" +
        JSON.stringify(payload, null, 2),
    );
    return { ok: false, error: "errNotConfigured" };
  }

  const sb = getSupabase()!;
  const reference = makeReference();

  const { error } = await sb
    .from("commissions")
    .insert({ ...payload, reference });

  if (error) {
    console.error("[ghurnilipi] commission insert failed:", error.message);
    return { ok: false, error: "errGeneric" };
  }

  return { ok: true, reference };
}
