"use client";

/**
 * Contact form. This is a demo: on submit it simply replaces the form
 * with a thank-you note. No data is sent anywhere.
 */

import { useState } from "react";
import type { FormEvent } from "react";
import { useI18n } from "./i18n-context";

const SUBJECT_KEYS = ["form.subject1", "form.subject2", "form.subject3", "form.subject4"];

export default function ContactForm() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Nothing to submit in this demo.
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="text-3xl" aria-hidden>
          ✅
        </p>
        <h2 className="mt-2 text-lg font-semibold text-emerald-900">
          {t("contact.receivedTitle")}
        </h2>
        <p className="mt-1 text-sm text-emerald-700">{t("contact.receivedNote")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">{t("form.name")}</span>
          <input
            type="text"
            name="name"
            required
            placeholder={t("form.name")}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-orange-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">{t("form.email")}</span>
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-orange-500"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">{t("form.subject")}</span>
        <select
          name="subject"
          className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500"
        >
          {SUBJECT_KEYS.map((key) => (
            <option key={key}>{t(key)}</option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">{t("form.message")}</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={t("form.message")}
          className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-orange-500"
        />
      </label>

      <button
        type="submit"
        className="rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
      >
        {t("form.send")}
      </button>
    </form>
  );
}
