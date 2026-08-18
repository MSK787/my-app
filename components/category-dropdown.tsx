"use client";

/**
 * "Categories" dropdown button for the store page toolbar.
 * Opens a panel with quick-browse links and every category (with counts).
 * The category row itself stays on one line — this gives one-click access
 * to the full list without leaving the page.
 */

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "./i18n-context";
import {
  QUICK_FILTERS,
  categories,
  countProductsByCategory,
} from "@/lib/products";

export default function CategoryDropdown() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const counts = countProductsByCategory();

  return (
    <div className="relative shrink-0">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-400 hover:text-amber-700"
      >
        <span aria-hidden>☰</span>
        {t("header.categories")}
        <span className="text-xs text-slate-500" aria-hidden>
          ▾
        </span>
      </button>

      {open && (
        <>
          {/* Click-anywhere backdrop to close */}
          <button
            type="button"
            aria-label={t("common.close")}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-30 cursor-default"
          />

          {/* Dropdown panel */}
          <div className="absolute left-0 top-full z-40 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl">
            {/* Quick browse */}
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t("header.quickBrowse")}
            </p>
            <ul className="mt-2">
              <li>
                <Link
                  href="/products"
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-amber-50 hover:text-amber-700"
                >
                  {t("header.allProducts")}
                </Link>
              </li>
              {QUICK_FILTERS.map((filter) => (
                <li key={filter.id}>
                  <Link
                    href={`/products?filter=${filter.id}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-amber-50 hover:text-amber-700"
                  >
                    {t(
                      `header.${
                        filter.id === "new"
                          ? "newArrivals"
                          : filter.id === "best-sellers"
                            ? "bestSellers"
                            : "featured"
                      }`
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Categories */}
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t("header.categories")}
            </p>
            <ul className="mt-2">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/products?category=${category.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-1.5 text-sm text-slate-600 transition hover:bg-amber-50 hover:text-amber-700"
                  >
                    {category.name}
                    <span className="text-xs text-slate-500">
                      {counts[category.id] ?? 0}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
