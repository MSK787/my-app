"use client";

/**
 * Quick view popup — the reference store's quick-view feature.
 * Shows the product without leaving the grid: image, key facts,
 * add-to-cart, buy-now and WhatsApp order.
 */

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { getCategoryLabel } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { buildBuyNowUrl } from "@/lib/links";
import { useI18n } from "./i18n-context";
import StarRating from "./star-rating";
import AddToCartButton from "./add-to-cart-button";
import WhatsAppButton from "./whatsapp-button";

export default function QuickViewModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { lang, t } = useI18n();

  // Close on the Escape key.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const inStock = product.stock !== "out";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${t("common.quickView")}: ${product.name}`}
    >
      {/* Click-outside backdrop */}
      <button
        type="button"
        aria-label={t("common.close")}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60"
      />

      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <button
          type="button"
          aria-label={t("common.close")}
          onClick={onClose}
          className="absolute end-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-600 shadow transition hover:text-slate-900"
        >
          ✕
        </button>

        <div className="grid max-h-[85vh] overflow-y-auto sm:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square bg-slate-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-3 p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {getCategoryLabel(product.category, lang)}
            </p>
            <Link
              href={`/products/${product.slug}`}
              onClick={onClose}
              className="text-xl font-bold leading-snug text-slate-900 hover:text-orange-700"
            >
              {product.name}
            </Link>
            <StarRating rating={product.rating} count={product.reviewCount} />

            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-extrabold text-slate-900">
                {formatPrice(product.price)}
              </p>
              {product.compareAtPrice && (
                <p className="text-sm text-slate-500 line-through">
                  {formatPrice(product.compareAtPrice)}
                </p>
              )}
            </div>

            {/* Top highlights, like the reference store's bullet lists */}
            <ul className="space-y-1.5">
              {product.highlights.slice(0, 4).map((highlight) => (
                <li key={highlight} className="flex gap-2 text-sm text-slate-600">
                  <span className="text-orange-600" aria-hidden>
                    ⚡
                  </span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="mt-auto flex flex-col gap-2 pt-4">
              <div className="flex gap-2">
                <AddToCartButton
                  product={product}
                  className="flex-1 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
                />
                <Link
                  href={inStock ? buildBuyNowUrl(product.slug, 1) : "#"}
                  aria-disabled={!inStock}
                  onClick={inStock ? onClose : undefined}
                  className={`flex-1 rounded-full border border-slate-900 px-4 py-2.5 text-center text-sm font-semibold transition ${
                    inStock
                      ? "text-slate-900 hover:border-orange-500 hover:text-orange-700"
                      : "pointer-events-none opacity-40"
                  }`}
                >
                  {t("common.buyNow")}
                </Link>
              </div>
              <WhatsAppButton
                product={product}
                className="rounded-full bg-emerald-700 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-emerald-800"
              />
              <Link
                href={`/products/${product.slug}`}
                onClick={onClose}
                className="text-center text-xs font-medium text-slate-500 transition hover:text-orange-700"
              >
                {t("common.viewDetails")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
