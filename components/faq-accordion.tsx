"use client";

/**
 * FAQ accordion built on native <details>/<summary> — fully accessible
 * and keyboard-friendly with zero custom state.
 */

import { useI18n } from "./i18n-context";

const ITEMS = ["1", "2", "3", "4", "5"] as const;

export default function FaqAccordion() {
  const { t } = useI18n();

  return (
    <section className="mx-auto max-w-3xl">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">{t("faq.title")}</h2>
        <p className="mt-1 text-sm text-slate-500">{t("faq.hint")}</p>
      </div>

      <div className="mt-6 space-y-3">
        {ITEMS.map((id) => (
          <details
            key={id}
            className="group rounded-2xl border border-slate-200 bg-white transition open:border-amber-300"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
              {t(`faq.${id}.q`)}
              <span
                aria-hidden
                className="shrink-0 text-slate-500 transition-transform group-open:rotate-180"
              >
                ▾
              </span>
            </summary>
            <p className="border-t border-slate-100 px-5 py-4 text-sm leading-6 text-slate-600">
              {t(`faq.${id}.a`)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
