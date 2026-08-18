"use client";

/**
 * The interactive part of the checkout page: adds "Buy now" items from the
 * URL, shows the order summary, and renders the (demo) checkout form.
 * Rendered inside a Suspense boundary by app/checkout/page.tsx.
 */

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart, lineProduct } from "@/components/cart-context";
import { useI18n } from "@/components/i18n-context";
import CheckoutForm from "@/components/checkout-form";
import { formatPrice } from "@/lib/format";
import { getShippingCost } from "@/lib/shipping";

export default function CheckoutContent() {
  const { lines, subtotal, addItem } = useCart();
  const { t } = useI18n();
  const searchParams = useSearchParams();

  // "Buy now" support: if the URL says ?add=slug&qty=2, put that item in
  // the cart once, then strip the params from the URL so a refresh doesn't
  // add it a second time. "applied" guards against double-handling.
  const buyNowSlug = searchParams.get("add");
  const buyNowQty = Number(searchParams.get("qty")) || 1;
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!buyNowSlug || applied) return;
    const frame = requestAnimationFrame(() => {
      addItem(buyNowSlug, buyNowQty);
      setApplied(true);
      // Clean the URL so refreshing the page doesn't re-add the item.
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("add");
        url.searchParams.delete("qty");
        window.history.replaceState({}, "", url.toString());
      }
    });
    return () => cancelAnimationFrame(frame);
    // addItem is intentionally excluded — see the cart context.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyNowSlug, buyNowQty, applied]);

  const shipping = getShippingCost(subtotal);
  const total = subtotal + shipping;

  // A buy-now request whose item hasn't landed yet — show a loading state
  // instead of flashing "Nothing to check out".
  const buyNowPending = !!buyNowSlug && !lines.some((l) => l.productSlug === buyNowSlug);
  if (buyNowPending) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">{t("checkout.title")}</h1>
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
          <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  // Nothing to check out — send the user back to the shop.
  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-5xl" aria-hidden>
          📦
        </p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          {t("checkout.nothingTitle")}
        </h1>
        <p className="mt-2 text-sm text-slate-500">{t("checkout.nothingHint")}</p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-full bg-slate-900 dark:bg-amber-500 px-6 py-3 text-sm font-semibold text-white dark:text-slate-900 transition hover:bg-amber-700"
        >
          {t("checkout.goShopping")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">{t("checkout.title")}</h1>
      <p className="mt-1 text-sm text-slate-500">{t("checkout.demoNote")}</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        {/* Shipping / contact form */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            {t("checkout.shippingDetails")}
          </h2>
          <div className="mt-4">
            <CheckoutForm />
          </div>
        </div>

        {/* Order summary */}
        <aside className="h-fit rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            {t("checkout.yourOrder")}
          </h2>

          <ul className="mt-4 space-y-4">
            {lines.map((line) => {
              const product = lineProduct(line);
              if (!product) return null;
              return (
                <li key={line.productSlug} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-slate-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {line.quantity} × {formatPrice(product.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900">
                    {formatPrice(product.price * line.quantity)}
                  </p>
                </li>
              );
            })}
          </ul>

          <dl className="mt-6 space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4 text-sm">
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
            <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-3 text-base">
              <dt className="font-semibold text-slate-900">{t("cart.total")}</dt>
              <dd className="font-bold text-slate-900">{formatPrice(total)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
