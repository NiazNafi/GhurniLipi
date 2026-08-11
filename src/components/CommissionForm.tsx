"use client";

import { useState, useTransition } from "react";

import { submitCommission } from "@/app/commission/actions";
import { PRODUCTS, PROMISE, SIZES } from "@/data/site";
import { emailWithCommission, whatsappWithCommission } from "@/lib/channels";
import { commissionMessage } from "@/lib/commission-message";
import { pick, t, type DictKey } from "@/lib/i18n";
import type { CommissionInput } from "@/lib/types";
import { useUiStore } from "@/store/ui";

/**
 * Messenger is off the list for now — see the note in src/lib/channels.ts. The
 * stored type still allows it, so rows filed before this change keep reading.
 */
const CHANNEL_OPTIONS = [
  { value: "whatsapp", labelKey: "channelWhatsapp" as DictKey },
  { value: "phone", labelKey: "channelPhone" as DictKey },
  { value: "email", labelKey: "channelEmail" as DictKey },
] as const;

const SCRIPTS = [
  { value: "bangla", labelKey: "scriptBangla" as DictKey },
  { value: "latin", labelKey: "scriptLatin" as DictKey },
  { value: "both", labelKey: "scriptBoth" as DictKey },
] as const;

const EMPTY: CommissionInput = {
  nameOneBn: "",
  nameOneEn: "",
  nameTwoBn: "",
  nameTwoEn: "",
  scriptPreference: "bangla",
  product: "framed-pair",
  size: "",
  occasion: "",
  deadline: "",
  notes: "",
  contactName: "",
  phone: "",
  email: "",
  preferredChannel: "whatsapp",
};

/** Resolves `?product=` into one of the tiers, tolerating anything unexpected. */
function initialForm(requestedProduct?: string): CommissionInput {
  if (!requestedProduct) return EMPTY;
  const known = PRODUCTS.find((p) => p.id === requestedProduct);
  if (known) return { ...EMPTY, product: known.id };
  // Gallery detail pages send `single` for a one-name piece, which is a framed
  // piece rather than a tier of its own.
  return EMPTY;
}

export function CommissionForm({
  requestedProduct,
}: {
  requestedProduct?: string;
}) {
  const lang = useUiStore((s) => s.lang);

  const [form, setForm] = useState<CommissionInput>(() =>
    initialForm(requestedProduct),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof CommissionInput>(
    key: K,
    value: CommissionInput[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) {
      setErrors((e) => {
        const next = { ...e };
        delete next[key];
        return next;
      });
    }
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.nameOneBn.trim() && !form.nameOneEn.trim()) {
      next.nameOneBn = "errNameOne";
    }
    if (form.phone.replace(/\D/g, "").length < 6) next.phone = "errPhone";
    if (!form.contactName.trim()) next.contactName = "errContactName";
    // Email is optional in general, but not if it is the channel they asked
    // to be answered on — otherwise the request arrives unreplyable.
    if (form.preferredChannel === "email" && !form.email.trim()) {
      next.email = "errEmailNeeded";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError(null);
    if (!validate()) return;

    startTransition(async () => {
      const result = await submitCommission(form);
      if (result.ok) {
        setReference(result.reference);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        if (result.fieldErrors) setErrors(result.fieldErrors as Record<string, string>);
        setFormError(result.error);
      }
    });
  }

  if (reference) {
    /**
     * What the buyer sees depends on the channel they picked, because the
     * channels are not equivalent. A phone call needs nothing further from
     * them. WhatsApp and email both carry the whole request, so each gets a
     * button that opens it already written — the reply comes either way, but
     * a buyer who starts the thread now gets answered in it.
     */
    const channel = form.preferredChannel;
    const nextKey = (
      {
        whatsapp: "nextWhatsapp",
        phone: "nextPhone",
        email: "nextEmail",
      } as const
    )[channel];

    const summary = commissionMessage(form, reference, lang);

    const action =
      channel === "whatsapp"
        ? {
            href: whatsappWithCommission(form, reference, lang),
            label: t("openWhatsapp", lang),
          }
        : channel === "email"
          ? {
              href: emailWithCommission(form, reference, lang),
              label: t("openEmail", lang),
            }
          : null;

    return (
      <div className="mt-10 rounded-sm border border-bone bg-paper-raised p-8 text-center">
        <p className="font-display text-3xl text-ink" lang={lang}>
          {t("submitDone", lang)}
        </p>
        <p className="mx-auto mt-3 max-w-sm text-ink-soft" lang={lang}>
          {t("submitDoneBody", lang)}
        </p>

        <p className="mt-6 font-mono text-2xl tracking-wider text-oxblood">
          {reference}
        </p>

        {/* Whichever channel they chose, the whole request stays one tap from
            the clipboard rather than something anyone has to retype. */}
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(summary).then(
              () => setCopied(true),
              () => setCopied(false),
            );
          }}
          className="mt-2 text-xs text-ink-faint underline decoration-ink-faint/40 underline-offset-4 hover:text-ink"
        >
          {t(copied ? "copiedReference" : "copyReference", lang)}
        </button>

        <p className="mx-auto mt-6 max-w-sm leading-relaxed text-ink-soft" lang={lang}>
          {t(nextKey, lang)}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {action && (
            <a
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper hover:bg-oxblood"
            >
              {action.label}
            </a>
          )}
          <button
            type="button"
            onClick={() => {
              setForm(EMPTY);
              setReference(null);
              setCopied(false);
            }}
            className="rounded-full border border-ink/20 px-6 py-3 text-sm text-ink hover:border-ink/50"
          >
            {t("submitAnother", lang)}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-10 space-y-10" noValidate>
      {/* ── the names ── */}
      <Fieldset legend={t("fieldNames", lang)} hint={t("spellingHelp", lang)}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={`${t("fieldNameOne", lang)} — ${t("inBangla", lang)}`}
            error={errors.nameOneBn}
            lang={lang}
            required
          >
            <input
              type="text"
              value={form.nameOneBn}
              onChange={(e) => set("nameOneBn", e.target.value)}
              lang="bn"
              autoComplete="off"
              className={inputClass(Boolean(errors.nameOneBn))}
            />
          </Field>
          <Field
            label={`${t("fieldNameOne", lang)} — ${t("inLatin", lang)}`}
            lang={lang}
          >
            <input
              type="text"
              value={form.nameOneEn}
              onChange={(e) => set("nameOneEn", e.target.value)}
              lang="en"
              autoComplete="off"
              className={inputClass(false)}
            />
          </Field>
          <Field
            label={`${t("fieldNameTwo", lang)} — ${t("inBangla", lang)}`}
            hint={t("fieldNameTwoHelp", lang)}
            lang={lang}
          >
            <input
              type="text"
              value={form.nameTwoBn}
              onChange={(e) => set("nameTwoBn", e.target.value)}
              lang="bn"
              autoComplete="off"
              className={inputClass(false)}
            />
          </Field>
          <Field
            label={`${t("fieldNameTwo", lang)} — ${t("inLatin", lang)}`}
            lang={lang}
          >
            <input
              type="text"
              value={form.nameTwoEn}
              onChange={(e) => set("nameTwoEn", e.target.value)}
              lang="en"
              autoComplete="off"
              className={inputClass(false)}
            />
          </Field>
        </div>

        <Field label={t("fieldScript", lang)} lang={lang} className="mt-6">
          <ChipGroup
            name="script"
            options={SCRIPTS.map((s) => ({
              value: s.value,
              label: t(s.labelKey, lang),
            }))}
            value={form.scriptPreference}
            onChange={(v) =>
              set("scriptPreference", v as CommissionInput["scriptPreference"])
            }
          />
        </Field>
      </Fieldset>

      {/* ── what they want ── */}
      <Fieldset legend={t("fieldProduct", lang)}>
        <div className="grid gap-3 sm:grid-cols-2">
          {PRODUCTS.map((product) => {
            const active = form.product === product.id;
            return (
              <label
                key={product.id}
                className={`cursor-pointer rounded-sm border p-4 transition-colors ${
                  active
                    ? "border-ink bg-paper-raised"
                    : "border-bone hover:border-ink-faint"
                }`}
              >
                <span className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="product"
                    value={product.id}
                    checked={active}
                    onChange={() => set("product", product.id)}
                    className="mt-1 accent-oxblood"
                  />
                  <span>
                    <span
                      className="block font-display text-lg text-ink"
                      lang={lang}
                    >
                      {pick(product.name, lang)}
                    </span>
                    <span
                      className="mt-1 block text-[0.82rem] leading-relaxed text-ink-soft"
                      lang={lang}
                    >
                      {pick(product.blurb, lang)}
                    </span>
                  </span>
                </span>
              </label>
            );
          })}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label={t("fieldSize", lang)} lang={lang}>
            <select
              value={form.size}
              onChange={(e) => set("size", e.target.value)}
              className={inputClass(false)}
            >
              <option value="">{t("sizeUnsure", lang)}</option>
              {SIZES.map((size) => (
                <option key={size.value} value={size.value}>
                  {pick(size.label, lang)}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("fieldOccasion", lang)} lang={lang}>
            <input
              type="text"
              value={form.occasion}
              onChange={(e) => set("occasion", e.target.value)}
              placeholder={t("occasionPlaceholder", lang)}
              className={inputClass(false)}
            />
          </Field>
          <Field label={t("fieldDeadline", lang)} lang={lang}>
            {/* Free text, not a date picker: "before Eid" is a real answer and
                a calendar would force people to invent a day they do not mean. */}
            <input
              type="text"
              value={form.deadline}
              onChange={(e) => set("deadline", e.target.value)}
              placeholder={t("deadlinePlaceholder", lang)}
              className={inputClass(false)}
            />
          </Field>
        </div>

        <Field label={t("fieldNotes", lang)} lang={lang} className="mt-5">
          <textarea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            rows={4}
            placeholder={t("notesPlaceholder", lang)}
            className={`${inputClass(false)} resize-y`}
          />
        </Field>
      </Fieldset>

      {/* ── how to reach them ── */}
      <Fieldset legend={t("fieldContact", lang)}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={t("fieldYourName", lang)}
            error={errors.contactName}
            lang={lang}
            required
          >
            <input
              type="text"
              value={form.contactName}
              onChange={(e) => set("contactName", e.target.value)}
              autoComplete="name"
              className={inputClass(Boolean(errors.contactName))}
            />
          </Field>
          <Field
            label={t("fieldPhone", lang)}
            error={errors.phone}
            lang={lang}
            required
          >
            <input
              type="tel"
              inputMode="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              className={inputClass(Boolean(errors.phone))}
            />
          </Field>
          <Field
            label={t("fieldEmail", lang)}
            hint={
              form.preferredChannel === "email"
                ? undefined
                : t("fieldEmailOptional", lang)
            }
            error={errors.email}
            required={form.preferredChannel === "email"}
            lang={lang}
          >
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              autoComplete="email"
              className={inputClass(Boolean(errors.email))}
            />
          </Field>
        </div>

        <Field label={t("fieldChannel", lang)} lang={lang} className="mt-6">
          <ChipGroup
            name="channel"
            options={CHANNEL_OPTIONS.map((c) => ({
              value: c.value,
              label: t(c.labelKey, lang),
            }))}
            value={form.preferredChannel}
            onChange={(v) =>
              set("preferredChannel", v as CommissionInput["preferredChannel"])
            }
          />
        </Field>
      </Fieldset>

      {formError && (
        <p
          role="alert"
          className="rounded-sm border border-oxblood/30 bg-oxblood/5 px-4 py-3 text-sm text-oxblood"
          lang={lang}
        >
          {t(formError as DictKey, lang)}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-8 py-4 text-sm font-medium text-paper transition-colors hover:bg-oxblood disabled:opacity-60"
        >
          {t(pending ? "submitting" : "submit", lang)}
        </button>
        <p className="text-sm text-ink-faint" lang={lang}>
          {pick(PROMISE.turnaround, lang)} · {pick(PROMISE.revisions, lang)}
        </p>
      </div>
    </form>
  );
}

/* ── small pieces ─────────────────────────────────────────────────────────── */

function inputClass(invalid: boolean): string {
  return [
    "w-full rounded-sm border bg-paper-raised px-3.5 py-3 text-[0.95rem] text-ink",
    "placeholder:text-ink-faint/70 transition-colors",
    invalid
      ? "border-oxblood focus:border-oxblood"
      : "border-bone focus:border-ink-faint",
  ].join(" ");
}

function Fieldset({
  legend,
  hint,
  children,
}: {
  legend: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t border-bone pt-6">
      <legend className="-mt-9 mb-4 bg-paper pr-3 font-display text-2xl text-ink">
        {legend}
      </legend>
      {hint && <p className="mb-5 max-w-lg text-sm text-ink-soft">{hint}</p>}
      {children}
    </fieldset>
  );
}

function Field({
  label,
  hint,
  error,
  required,
  lang,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  lang: "bn" | "en";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-baseline gap-2">
        <span className="text-[0.82rem] font-medium text-ink" lang={lang}>
          {label}
        </span>
        {required && (
          <span className="text-[0.7rem] text-oxblood" lang={lang}>
            {t("required", lang)}
          </span>
        )}
        {hint && !error && (
          <span className="text-[0.72rem] text-ink-faint" lang={lang}>
            {hint}
          </span>
        )}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 block text-[0.75rem] text-oxblood" lang={lang}>
          {t(error as DictKey, lang)}
        </span>
      )}
    </label>
  );
}

function ChipGroup({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = value === option.value;
        return (
          <label
            key={option.value}
            className={`cursor-pointer rounded-full border px-4 py-2 text-[0.82rem] transition-colors ${
              active
                ? "border-ink bg-ink text-paper"
                : "border-bone text-ink-soft hover:border-ink-faint hover:text-ink"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={active}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
