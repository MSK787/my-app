"use client";

/**
 * Store toolbar: search box, sort dropdown, in-stock toggle and the
 * result count. Every control is a plain form/link — the filtering itself
 * happens on the server, so all of this works without JavaScript.
 */

import Link from "next/link";
import { useI18n } from "@/components/i18n-context";

export default function StoreToolbar({
  query,
  category,
  quickFilter,
  stockOnly,
  sort,
  resultCount,
}: {
  query: string;
  category: string;
  quickFilter: string;
  stockOnly: boolean;
  sort: string;
  resultCount: number;
}) {
  const { t } = useI18n();

  return (
    <div className="mt-5 flex flex-wrap items-center gap-3">
      {/* Search box */}
      <form action="/products" className="flex flex-1 items-center gap-2 sm:max-w-xs">
        <div className="relative w-full">
          <label htmlFor="store-search" className="sr-only">
            {t("common.search")}
          </label>
          <input
            id="store-search"
            type="text"
            name="query"
            defaultValue={query}
            placeholder={t("store.searchPlaceholder")}
            className="w-full rounded-full border border-slate-300 bg-slate-50 py-2.5 ps-5 pe-12 text-sm outline-none transition focus:border-amber-500 focus:bg-white"
          />
          <button
            type="submit"
            aria-label={t("common.search")}
            className="absolute end-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-amber-500 text-sm text-slate-900 transition hover:bg-amber-600"
          >
            🔍
          </button>
        </div>
      </form>

      {/* Sort dropdown */}
      <form action="/products" className="flex items-center gap-2">
        {query && <input type="hidden" name="query" value={query} />}
        {category && <input type="hidden" name="category" value={category} />}
        {quickFilter && <input type="hidden" name="filter" value={quickFilter} />}
        {stockOnly && <input type="hidden" name="stock" value="only" />}
        <label htmlFor="sort" className="text-sm text-slate-500">
          {t("common.sort")}
        </label>
        <select
          id="sort"
          name="sort"
          defaultValue={sort}
          className="rounded-full border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
        >
          <option value="featured">{t("common.sortFeatured")}</option>
          <option value="price-asc">{t("common.sortPriceAsc")}</option>
          <option value="price-desc">{t("common.sortPriceDesc")}</option>
        </select>
        <button
          type="submit"
          className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-amber-100"
        >
          {t("common.apply")}
        </button>
      </form>

      {/* In-stock toggle */}
      <Link
        href={stockOnly ? "/products" : "/products?stock=only"}
        className="flex items-center gap-2 text-sm text-slate-600"
      >
        <span
          aria-hidden
          className={`grid h-5 w-9 items-center rounded-full p-0.5 transition ${
            stockOnly ? "bg-amber-500" : "bg-slate-300"
          }`}
        >
          <span
            className={`h-4 w-4 rounded-full bg-white transition ${
              stockOnly ? "translate-x-4 rtl:-translate-x-4" : ""
            }`}
          />
        </span>
        {t("common.inStockOnly")}
      </Link>

      {/* Result count (proper singular/plural in both languages) */}
      <p className="ms-auto text-sm text-slate-500">
        {resultCount === 1
          ? t("common.oneProduct")
          : t("common.productsCount", { count: resultCount })}
      </p>
    </div>
  );
}
