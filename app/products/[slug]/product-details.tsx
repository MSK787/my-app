"use client";

/**
 * The interactive product page: breadcrumb, image, price, stock note,
 * highlights, buy actions, spec table and related products.
 * All labels follow the active language (English / Arabic).
 *
 * The optional ?qty= URL param (used by "Buy now" links) is read once on
 * mount from window.location — not useSearchParams — so this component can
 * render on the server: crawlers and no-JS users get the full page (h1,
 * description, specs), not a skeleton.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/products";
import { getCategoryLabel } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { buildBuyNowUrl } from "@/lib/links";
import { useI18n } from "@/components/i18n-context";
import StarRating from "@/components/star-rating";
import AddToCartButton from "@/components/add-to-cart-button";
import WhatsAppButton from "@/components/whatsapp-button";
import ProductCard from "@/components/product-card";

/** Reads ?qty= from the URL, clamped to 1–99 (guards non-numeric values). */
function readQtyFromUrl(): number {
  if (typeof window === "undefined") return 1;
  const parsed = Number(new URLSearchParams(window.location.search).get("qty"));
  return Number.isFinite(parsed) ? Math.max(1, Math.min(99, parsed)) : 1;
}

export default function ProductDetails({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { lang, t } = useI18n();
  // Default 1 on the server AND first client render (no hydration mismatch);
  // the effect below corrects it to the URL's value right after mount.
  const [qty, setQty] = useState(1);

  // Apply the URL's qty on the next frame (callback, not synchronous effect
  // body — keeps the react-hooks/set-state-in-effect rule happy).
  useEffect(() => {
    const frame = requestAnimationFrame(() => setQty(readQtyFromUrl()));
    return () => cancelAnimationFrame(frame);
  }, []);

  const inStock = product.stock !== "out";

  const stockLabel =
    product.stock === "out"
      ? t("common.outOfStock")
      : product.stock === "low"
        ? t("common.lowStock")
        : t("common.inStock");

  const stockColor =
    product.stock === "out"
      ? "text-red-600"
      : product.stock === "low"
        ? "text-orange-700"
        : "text-emerald-700";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-orange-700">
          {t("store.home")}
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-orange-700">
          {t("store.title")}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/products?category=${product.category}`}
          className="hover:text-orange-700"
        >
          {getCategoryLabel(product.category, lang)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-800">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-slate-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          {product.badge && (
            <span className="absolute start-4 top-4 rounded-full bg-orange-500 px-4 py-1.5 text-sm font-bold text-slate-900 shadow">
              {product.badge}
            </span>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            {getCategoryLabel(product.category, lang)}
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-slate-900">
            {product.name}
          </h1>

          <div className="mt-3">
            <StarRating rating={product.rating} count={product.reviewCount} />
          </div>

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-3">
            <p className="text-4xl font-extrabold text-slate-900">
              {formatPrice(product.price)}
            </p>
            {product.compareAtPrice && (
              <p className="text-lg text-slate-500 line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            )}
          </div>

          {/* Stock note */}
          <p className={`mt-2 text-sm font-medium ${stockColor}`}>{stockLabel}</p>

          {/* Description */}
          <p className="mt-5 leading-7 text-slate-600">{product.description}</p>

          {/* Highlights */}
          <ul className="mt-5 space-y-2">
            {product.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-2 text-sm text-slate-700">
                <span className="text-orange-600" aria-hidden>
                  ⚡
                </span>
                {highlight}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AddToCartButton
              product={product}
              className="rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
            />
            <Link
              href={inStock ? buildBuyNowUrl(product.slug, qty) : "#"}
              aria-disabled={!inStock}
              className={`rounded-full border border-slate-900 px-8 py-3 text-center text-sm font-semibold transition ${
                inStock
                  ? "text-slate-900 hover:border-orange-500 hover:text-orange-700"
                  : "pointer-events-none opacity-40"
              }`}
            >
              {t("common.buyNow")}
            </Link>
            <WhatsAppButton
              product={product}
              className="rounded-full bg-emerald-700 px-8 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-800"
            />
          </div>

          {/* Spec table */}
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-slate-900">
              {t("product.specifications")}
            </h2>
            <table className="mt-3 w-full text-sm">
              <tbody>
                {product.specs.map((spec, index) => (
                  <tr
                    key={spec.label}
                    className={index % 2 === 0 ? "bg-slate-50" : ""}
                  >
                    {/* scope="row": this cell is the header of its row */}
                    <td scope="row" className="w-1/3 rounded-s-lg px-4 py-2.5 font-medium text-slate-500">
                      {spec.label}
                    </td>
                    <td className="rounded-e-lg px-4 py-2.5 text-slate-800">
                      {spec.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900">{t("product.related")}</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
