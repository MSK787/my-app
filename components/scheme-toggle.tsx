"use client";

/**
 * Color-scheme toggle: System / Light / Dark.
 *
 * The choice is stored in localStorage and applied as a `dark` class on
 * <html> plus the native `color-scheme`. "System" live-follows the OS
 * preference via matchMedia. A pre-paint <Script> in layout.tsx applies the
 * saved choice before first render, so there is never a flash.
 *
 * Hydration: the server always renders "system" active. The stored choice
 * is applied only after mount (next frame), so server and first client
 * render agree — no hydration warnings.
 */

import { useEffect, useState } from "react";
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

/** Applies a scheme to the document: class + native color-scheme. */
function applyScheme(scheme: Scheme) {
  const dark =
    scheme === "dark" ||
    (scheme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

/** Inline SVG icons — crisp on every platform (no emoji-font surprises). */
function Icon({ kind }: { kind: Scheme }) {
  if (kind === "light") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5" aria-hidden>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  }
  if (kind === "dark") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}

const OPTIONS: { id: Scheme; labelKey: string }[] = [
  { id: "system", labelKey: "scheme.system" },
  { id: "light", labelKey: "scheme.light" },
  { id: "dark", labelKey: "scheme.dark" },
];

export default function SchemeToggle() {
  const { t } = useI18n();
  const [scheme, setScheme] = useState<Scheme>("system");
  const [mounted, setMounted] = useState(false);

  // After mount: read the saved choice and keep following changes from
  // other tabs / this one. Scheduled on the next frame (no sync setState
  // inside the effect body).
  useEffect(() => {
    const update = () => setScheme(readScheme());
    const frame = requestAnimationFrame(update);
    window.addEventListener("storage", update);
    window.addEventListener(SCHEME_EVENT, update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("storage", update);
      window.removeEventListener(SCHEME_EVENT, update);
    };
  }, []);

  // Mounted marker for the active-state rendering (hydration-safe).
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Keep the document in sync with the chosen scheme. Skipped until mount so
  // the pre-paint script's result stands; "system" live-follows the OS.
  useEffect(() => {
    if (!mounted) return;
    applyScheme(scheme);
    if (scheme !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyScheme("system");
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [mounted, scheme]);

  function choose(next: Scheme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked — the choice still applies for this session.
    }
    window.dispatchEvent(new Event(SCHEME_EVENT));
  }

  // Same value the server rendered until mounted.
  const active = mounted ? scheme : "system";

  return (
    <div
      role="group"
      aria-label={t("scheme.label")}
      className="flex items-center gap-0.5 rounded-full border border-slate-200 dark:border-slate-800 p-0.5 dark:border-slate-700"
    >
      {OPTIONS.map((option) => {
        const isActive = option.id === active;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => choose(option.id)}
            aria-pressed={isActive}
            title={t(option.labelKey)}
            className={`grid h-7 w-7 place-items-center rounded-full transition ${
              isActive
                ? "bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900 dark:bg-amber-500 dark:text-slate-900"
                : "text-slate-500 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-400 dark:text-slate-300 dark:hover:text-amber-400"
            }`}
          >
            <Icon kind={option.id} />
            <span className="sr-only">{t(option.labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
