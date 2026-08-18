"use client";

/**
 * Newsletter signup in the footer. Demo only — submitting just shows
 * a confirmation. No data is sent anywhere.
 */

import { useState } from "react";
import type { FormEvent } from "react";
import { useI18n } from "./i18n-context";

export default function NewsletterForm() {
  const { t } = useI18n();
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
  }

  if (subscribed) {
    return (
      <p className="rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 px-4 py-3 text-sm text-emerald-700">
        {t("newsletter.done")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        {t("form.email")}
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        placeholder={t("newsletter.placeholder")}
        className="w-full rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm outline-none focus:border-amber-500"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-slate-900 dark:bg-amber-500 px-4 py-2 text-sm font-semibold text-white dark:text-slate-900 transition hover:bg-amber-700"
      >
        {t("newsletter.join")}
      </button>
    </form>
  );
}
