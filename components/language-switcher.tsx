"use client";

/** EN / عربي toggle shown in the header. */

import { useI18n } from "./i18n-context";

const OPTIONS = [
  { id: "en", label: "EN" },
  { id: "ar", label: "عربي" },
] as const;

export default function LanguageSwitcher() {
  const { lang, t, setLang } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("header.language")}
      className="flex overflow-hidden rounded-full border border-slate-200"
    >
      {OPTIONS.map((option) => {
        const isActive = option.id === lang;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setLang(option.id)}
            aria-pressed={isActive}
            className={`px-3 py-1.5 text-xs font-bold transition ${
              isActive
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-600 hover:text-amber-700"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
