"use client";

/** Breadcrumb + heading for the store page (localized). */

import Link from "next/link";
import { useI18n } from "@/components/i18n-context";
import { getCategoryLabel } from "@/lib/products";

export default function StoreHeader({
  query,
  category,
  quickFilter,
}: {
  query: string;
  category: string;
  quickFilter: string;
}) {
  const { lang, t } = useI18n();

  // The heading mirrors what is being shown: a search, a category, a
  // quick-browse list, or the whole catalog.
  const heading = query
    ? t("store.searchResults", { query })
    : category
      ? getCategoryLabel(category, lang)
      : quickFilter === "new"
        ? t("store.newArrivals")
        : quickFilter === "best-sellers"
          ? t("store.bestSellers")
          : quickFilter === "featured"
            ? t("store.featured")
            : t("store.allProducts");

  return (
    <>
      <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-orange-700">
          {t("store.home")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">{t("store.title")}</span>
      </nav>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">{heading}</h1>
    </>
  );
}
