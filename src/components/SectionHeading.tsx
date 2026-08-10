"use client";

import { t, type DictKey } from "@/lib/i18n";
import { useUiStore } from "@/store/ui";

interface Props {
  kicker: DictKey;
  title: DictKey;
  body?: DictKey;
  align?: "left" | "center";
}

export function SectionHeading({ kicker, title, body, align = "left" }: Props) {
  const lang = useUiStore((s) => s.lang);
  const centered = align === "center";

  return (
    <div className={centered ? "mx-auto max-w-xl text-center" : "max-w-xl"}>
      <p className="text-[11px] tracking-[0.18em] text-oxblood uppercase">
        {t(kicker, lang)}
      </p>
      <h2
        className="mt-3 font-display text-3xl leading-[var(--leading-bangla)] text-ink sm:text-4xl"
        lang={lang}
      >
        {t(title, lang)}
      </h2>
      {body && (
        <p className="mt-4 leading-relaxed text-ink-soft" lang={lang}>
          {t(body, lang)}
        </p>
      )}
    </div>
  );
}
