/**
 * The store page — modeled on eng-elec.com:
 *   - Category bar: one horizontal line (scrolls on small screens, never
 *     wraps) with a "Categories" dropdown + one chip per category
 *   - Toolbar: search, sort and an in-stock toggle
 *   - Full-width results: grid or list view, quick-view popup,
 *     WhatsApp ordering
 *
 * Filtering happens on the server: every control is a form or a link,
 * so the page works even without JavaScript. The visible text lives in
 * client components so it can follow the active language (EN/AR).
 *
 * NOTE: in Next.js 16, searchParams is a Promise and must be awaited.
 */

import type { Metadata } from "next";
import { filterProducts } from "@/lib/products";
import StoreHeader from "./store-header";
import CategoryBar from "./category-bar";
import StoreToolbar from "./store-toolbar";
import StoreGrid from "./store-grid";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Browse all solar panels, inverters, batteries, cables and electrical equipment.",
  alternates: { canonical: "/products" },
};

interface StoreSearchParams {
  query?: string;
  category?: string;
  sort?: string;
  filter?: string;
  stock?: string;
}

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<StoreSearchParams>;
}) {
  const params = await searchParams;

  const query = params.query ?? "";
  const category = params.category ?? "";
  const sort = params.sort ?? "featured";
  const quickFilter = params.filter ?? "";
  const stockOnly = params.stock === "only";

  // All filtering (including token-based EN/AR search) runs here.
  const results = filterProducts({
    category,
    query,
    sort,
    filter: quickFilter,
    inStockOnly: stockOnly,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <StoreHeader query={query} category={category} quickFilter={quickFilter} />
      <CategoryBar activeCategory={category} />
      <StoreToolbar
        query={query}
        category={category}
        quickFilter={quickFilter}
        stockOnly={stockOnly}
        sort={sort}
        resultCount={results.length}
      />
      <div className="mt-6">
        <StoreGrid products={results} />
      </div>
    </div>
  );
}
