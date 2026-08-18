"use client";

/**
 * Color-scheme toggle: System / Light / Dark.
 *
 * The choice is stored in localStorage (like the language and the cart) and
 * applied as a `dark` class on <html> plus the native `color-scheme`, so
 * Tailwind's `dark:` variants and every form control/scrollbar follow it.
 * "System" live-follows the OS preference via matchMedia.
 * A pre-paint script in layout.tsx applies the saved choice before first
 * render, so there is never a flash of the wrong scheme.
 */

import { useEffect, useSyncExternalStore } from "react";
import { useI18n } from "./i18n-context";

export type Scheme = "system" | "light" | "dark";

const STORAGE_KEY = "sunvolt-scheme";
const SCHEME_EVENT = "sunvolt-scheme-change";

function readScheme(): Scheme {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
  } catch {
    // Storage blocked — fall through to "system".
  }
  return "system";
}

function subscribeScheme(listener: () => void): () => void {
  window.addEventListener("storage", listener);
  window.addEventListener(SCHEME_EVENT, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(SCHEME_EVENT, listener);
  };
}

/** Applies a scheme to the document: class + native color-scheme. */
function applyScheme(scheme: Scheme) {
  const dark =
    scheme === "dark" ||
    (scheme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

const OPTIONS: { id: Scheme; icon: string; labelKey: string }[] = [
  { id: "system", icon: "🌓", labelKey: "scheme.system" },
  { id: "light", icon: "☀️", labelKey: "scheme.light" },
  { id: "dark", icon: "🌙", labelKey: "scheme.dark" },
];

export default function SchemeToggle() {
  const { t } = useI18n();
  const scheme = useSyncExternalStore(
    subscribeScheme,
    readScheme,
    () => "system" as Scheme
  );

  // Keep the document in sync with the chosen scheme — DOM-only work, the
  // intended use of an effect. In "system" mode we also live-follow the OS
  // preference as it changes.
  useEffect(() => {
    applyScheme(scheme);
    if (scheme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyScheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [scheme]);

  function choose(next: Scheme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked — the choice still applies for this session.
    }
    window.dispatchEvent(new Event(SCHEME_EVENT));
  }

  return (
    <div
      role="group"
      aria-label={t("scheme.label")}
      className="flex overflow-hidden rounded-full border border-slate-200 dark:border-slate-700"
    >
      {OPTIONS.map((option) => {
        const isActive = scheme === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => choose(option.id)}
            aria-pressed={isActive}
            title={t(option.labelKey)}
            className={`px-2.5 py-1.5 text-sm transition ${
              isActive
                ? "bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-900"
                : "bg-white text-slate-600 hover:text-amber-600 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-amber-400"
            }`}
          >
            <span aria-hidden>{option.icon}</span>
            <span className="sr-only">{t(option.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
