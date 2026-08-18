"use client";

/**
 * Product card used in every product grid.
 * Mirrors the reference store: image, badge, quick-view overlay,
 * bullet highlights, rating, price, add-to-cart and WhatsApp order.
 * Category names and labels follow the active language.
 */

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { getCategoryLabel } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useI18n } from "./i18n-context";
import StarRating from "./star-rating";
import AddToCartButton from "./add-to-cart-button";
import WhatsAppButton from "./whatsapp-button";
import QuickViewModal from "./quick-view-modal";

export default function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useI18n();
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70">
        {/* Image + overlays */}
        <div className="relative">
          <Link
            href={`/products/${product.slug}`}
            className="relative block aspect-square overflow-hidden bg-slate-100"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Ribbon badge */}
          {product.badge && (
            <span className="absolute start-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-slate-900 shadow">
              {product.badge}
            </span>
          )}

          {/* Out-of-stock overlay */}
          {product.stock === "out" && (
            <span className="absolute end-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-xs font-semibold text-white">
              {t("common.outOfStock")}
            </span>
          )}

          {/* Quick view — appears on hover */}
          <button
            type="button"
            onClick={() => setQuickViewOpen(true)}
            className="absolute inset-x-3 bottom-3 rounded-full bg-white/95 py-2 text-xs font-semibold text-slate-900 opacity-0 shadow transition hover:text-orange-700 group-hover:opacity-100 focus-visible:opacity-100"
          >
            {t("common.quickView")}
          </button>
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {getCategoryLabel(product.category, lang)}
          </p>
          <Link href={`/products/${product.slug}`}>
            <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900 hover:text-orange-700">
              {product.name}
            </h2>
          </Link>

          {/* Top highlights, like the reference store's bullets */}
          <ul className="space-y-0.5">
            {product.highlights.slice(0, 3).map((highlight) => (
              <li key={highlight} className="line-clamp-1 text-xs text-slate-500">
                • {highlight}
              </li>
            ))}
          </ul>

          <StarRating rating={product.rating} count={product.reviewCount} />

          <div className="flex items-end gap-2">
            <p className="text-lg font-bold text-slate-900">
              {formatPrice(product.price)}
            </p>
            {product.compareAtPrice && (
              <p className="text-xs text-slate-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            )}
          </div>

          {/* Actions: add to cart + WhatsApp quick-order */}
          <div className="mt-auto flex items-center gap-2 pt-2">
            <AddToCartButton
              product={product}
              className="flex-1 rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
            />
            <WhatsAppButton
              product={product}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-700 text-base text-white transition hover:bg-emerald-800"
            >
              💬
            </WhatsAppButton>
          </div>
        </div>
      </div>

      {quickViewOpen && (
        <QuickViewModal
          product={product}
          onClose={() => setQuickViewOpen(false)}
        />
      )}
    </>
  );
}
