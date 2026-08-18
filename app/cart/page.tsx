/**
 * Cart page. Shows every cart line with a quantity stepper,
 * a shipping estimator and a checkout button. All labels localized.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart, lineProduct } from "@/components/cart-context";
import { useI18n } from "@/components/i18n-context";
import { formatPrice } from "@/lib/format";
import {
  FLAT_SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
  getShippingCost,
} from "@/lib/shipping";

export default function CartPage() {
  const { lines, itemCount, subtotal, setQuantity, removeItem } = useCart();
  const { t } = useI18n();

  const shipping = getShippingCost(subtotal);
  const total = subtotal + shipping;
  const progressToFreeShipping = Math.min(
    1,
    subtotal / FREE_SHIPPING_THRESHOLD
  );

  // Empty cart state.
  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-5xl" aria-hidden>
          🛒
        </p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          {t("cart.emptyTitle")}
        </h1>
        <p className="mt-2 text-sm text-slate-500">{t("cart.emptyHint")}</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
        >
          {t("cart.startShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">
        {t("cart.title")}{" "}
        <span className="text-lg font-medium text-slate-500">
          {itemCount === 1
            ? t("cart.oneItem")
            : t("cart.items", { count: itemCount })}
        </span>
      </h1>

      {/* Free shipping progress */}
      <div className="mt-4 max-w-xl rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-medium text-amber-900">
          {shipping === 0
            ? t("cart.unlocked")
            : t("cart.moreForFree", {
                amount: formatPrice(FREE_SHIPPING_THRESHOLD - subtotal),
              })}
        </p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-amber-200">
          <div
            className="h-full rounded-full bg-amber-500 transition-all"
            style={{ width: `${progressToFreeShipping * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        {/* Cart lines */}
        <ul className="space-y-4 lg:col-span-2">
          {lines.map((line) => {
            const product = lineProduct(line);
            // Skip lines whose product vanished from the catalog.
            if (!product) return null;

            return (
              <li
                key={line.productSlug}
                className="flex gap-4 rounded-2xl border border-slate-200 p-4"
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-sm font-semibold text-slate-900 hover:text-amber-700"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {formatPrice(product.price)} {t("common.each")}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    {/* Quantity stepper */}
                    <div className="flex items-center rounded-full border border-slate-300">
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(line.productSlug, line.quantity - 1)
                        }
                        className="px-3 py-1 text-slate-600 transition hover:text-amber-700"
                        aria-label={t("common.decreaseQty", { name: product.name })}
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center text-sm font-semibold">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity(line.productSlug, line.quantity + 1)
                        }
                        className="px-3 py-1 text-slate-600 transition hover:text-amber-700"
                        aria-label={t("common.increaseQty", { name: product.name })}
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-sm font-bold text-slate-900">
                        {formatPrice(product.price * line.quantity)}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeItem(line.productSlug)}
                        className="text-xs font-medium text-slate-500 underline-offset-2 transition hover:text-red-600 hover:underline"
                      >
                        {t("common.remove")}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Order summary */}
        <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            {t("cart.summary")}
          </h2>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">{t("cart.subtotal")}</dt>
              <dd className="font-semibold text-slate-900">
                {formatPrice(subtotal)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">{t("cart.shipping")}</dt>
              <dd className="font-semibold text-slate-900">
                {shipping === 0 ? t("cart.free") : formatPrice(shipping)}
              </dd>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-slate-500">
                {t("cart.shippingNote", {
                  fee: formatPrice(FLAT_SHIPPING_FEE),
                  threshold: formatPrice(FREE_SHIPPING_THRESHOLD),
                })}
              </p>
            )}
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
              <dt className="font-semibold text-slate-900">{t("cart.total")}</dt>
              <dd className="font-bold text-slate-900">{formatPrice(total)}</dd>
            </div>
          </dl>

          <Link
            href="/checkout"
            className="mt-6 block rounded-full bg-slate-900 py-3 text-center text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            {t("cart.checkout")}
          </Link>
          <Link
            href="/products"
            className="mt-3 block text-center text-sm font-medium text-slate-500 hover:text-amber-700"
          >
            {t("cart.continueShopping")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
