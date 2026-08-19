"use client";

/**
 * EN / عربي toggle shown in the header.
 *
 * The saved language is read from an external store (localStorage), so the
 * server always renders "en" active. To keep hydration warning-free, the
 * active state is frozen on "en" until the component mounts — then the
 * stored choice is applied on the next frame.
 */

import { useEffect, useState } from "react";
import { useI18n } from "./i18n-context";

const OPTIONS = [
  { id: "en", label: "EN" },
  { id: "ar", label: "عربي" },
] as const;

export default function LanguageSwitcher() {
  const { lang, t, setLang } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Until mounted, render the same "en" state as the server.
  const active = mounted ? lang : "en";

  return (
    <div
      role="group"
      aria-label={t("header.language")}
      className="flex overflow-hidden rounded-full border border-slate-200 dark:border-slate-800 dark:border-slate-700"
    >
      {OPTIONS.map((option) => {
        const isActive = option.id === active;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setLang(option.id)}
            aria-pressed={isActive}
            className={`px-3 py-1.5 text-xs font-bold transition ${
              isActive
                ? "bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900 dark:bg-amber-500 dark:text-slate-900"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 dark:bg-slate-900 dark:bg-amber-500 dark:text-slate-300 dark:hover:text-amber-400"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
