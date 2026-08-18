"use client";

/** 404 page — shown for unknown routes and missing products. */

import Link from "next/link";
import { useI18n } from "@/components/i18n-context";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="text-6xl font-extrabold text-amber-500">404</p>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">{t("notFound.title")}</h1>
      <p className="mt-2 text-sm text-slate-500">{t("notFound.text")}</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
        >
          {t("notFound.home")}
        </Link>
        <Link
          href="/products"
          className="rounded-full border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-amber-500 hover:text-amber-700"
        >
          {t("notFound.browse")}
        </Link>
      </div>
    </div>
  );
}
