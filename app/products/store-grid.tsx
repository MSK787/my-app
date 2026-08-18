"use client";

/**
 * The product results panel of the store page, in two views:
 *   - Grid: product cards (default)
 *   - List: horizontal rows with image, description and actions
 * Both use the same data passed from the server component above.
 */

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { getCategoryLabel } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useI18n } from "@/components/i18n-context";
import Reveal from "@/components/reveal";
import ProductCard from "@/components/product-card";
import StarRating from "@/components/star-rating";
import AddToCartButton from "@/components/add-to-cart-button";
import WhatsAppButton from "@/components/whatsapp-button";

export default function StoreGrid({ products }: { products: Product[] }) {
  const { t } = useI18n();
  const [view, setView] = useState<"grid" | "list">("grid");

  // No results — offer to clear filters.
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center">
        <p className="text-4xl" aria-hidden>
          🔍
        </p>
        <h2 className="mt-3 text-lg font-semibold text-slate-900">
          {t("common.noResults")}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{t("common.noResultsHint")}</p>
        <Link
          href="/products"
          className="mt-4 inline-block rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          {t("common.clearFilters")}
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* View toggle */}
      <div className="mb-4 flex justify-end gap-1">
        <button
          type="button"
          onClick={() => setView("grid")}
          aria-pressed={view === "grid"}
          aria-label={t("common.gridView")}
          className={`grid h-9 w-9 place-items-center rounded-lg border text-sm transition ${
            view === "grid"
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 text-slate-500 hover:border-slate-400"
          }`}
        >
          ▦
        </button>
        <button
          type="button"
          onClick={() => setView("list")}
          aria-pressed={view === "list"}
          aria-label={t("common.listView")}
          className={`grid h-9 w-9 place-items-center rounded-lg border text-sm transition ${
            view === "list"
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 text-slate-500 hover:border-slate-400"
          }`}
        >
          ☰
        </button>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product, index) => (
            <Reveal key={product.slug} delay={(index % 8) * 50}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      ) : (
        <ul className="space-y-4">
          {products.map((product) => (
            <ListRow key={product.slug} product={product} />
          ))}
        </ul>
      )}
    </div>
  );
}

/** One horizontal row in list view: image, facts, price, actions. */
function ListRow({ product }: { product: Product }) {
  const { lang, t } = useI18n();

  return (
    <li className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition hover:shadow-lg hover:shadow-slate-200/70">
      <Link
        href={`/products/${product.slug}`}
        className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-36 sm:w-36"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="144px"
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {getCategoryLabel(product.category, lang)}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h2 className="mt-0.5 text-sm font-semibold text-slate-900 hover:text-orange-700 sm:text-base">
            {product.name}
          </h2>
        </Link>
        <StarRating rating={product.rating} count={product.reviewCount} />

        <p className="mt-2 hidden text-sm leading-6 text-slate-500 sm:line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-bold text-slate-900 sm:text-xl">
              {formatPrice(product.price)}
            </p>
            {product.compareAtPrice && (
              <p className="text-xs text-slate-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <AddToCartButton
              product={product}
              className="rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
            />
            <WhatsAppButton
              product={product}
              className="rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800"
            >
              💬 {t("contact.whatsapp")}
            </WhatsAppButton>
          </div>
        </div>
      </div>
    </li>
  );
}
