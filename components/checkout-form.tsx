"use client";

/**
 * Checkout form. Demo only — on submit it clears the cart and shows
 * a fake order confirmation. There is no payment processing.
 */

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useCart } from "./cart-context";
import { useI18n } from "./i18n-context";
import { formatPrice } from "@/lib/format";
import { getShippingCost } from "@/lib/shipping";

const COUNTRY_KEYS = ["countries.nl", "countries.be", "countries.de", "countries.other"];

export default function CheckoutForm() {
  const { subtotal, clear } = useCart();
  const { t } = useI18n();
  const [placed, setPlaced] = useState(false);
  const [orderNumber] = useState(() =>
    Math.floor(100000 + Math.random() * 900000)
  );

  const shipping = getShippingCost(subtotal);
  const total = subtotal + shipping;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clear(); // Empty the cart — order "placed".
    setPlaced(true);
  }

  if (placed) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="text-3xl" aria-hidden>
          🎉
        </p>
        <h2 className="mt-2 text-lg font-semibold text-emerald-900">
          {t("checkout.placedTitle", { order: orderNumber })}
        </h2>
        <p className="mt-1 text-sm text-emerald-700">{t("checkout.placedNote")}</p>
        <Link
          href="/products"
          className="mt-4 inline-block rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
        >
          {t("checkout.keepShopping")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            {t("form.firstName")}
          </span>
          <input
            type="text"
            name="firstName"
            required
            placeholder={t("form.firstName")}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-orange-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            {t("form.lastName")}
          </span>
          <input
            type="text"
            name="lastName"
            required
            placeholder={t("form.lastName")}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-orange-500"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">{t("form.email")}</span>
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-orange-500"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700">{t("form.address")}</span>
        <input
          type="text"
          name="address"
          required
          placeholder={t("form.address")}
          className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-orange-500"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">{t("form.city")}</span>
          <input
            type="text"
            name="city"
            required
            placeholder={t("form.city")}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-orange-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">
            {t("form.postalCode")}
          </span>
          <input
            type="text"
            name="postalCode"
            required
            placeholder="1011 AB"
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-orange-500"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">{t("form.country")}</span>
          <select
            name="country"
            className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-orange-500"
          >
            {COUNTRY_KEYS.map((key) => (
              <option key={key}>{t(key)}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-orange-200 bg-orange-50 p-4">
        <p className="text-sm font-medium text-orange-900">{t("checkout.orderTotal")}</p>
        <p className="text-lg font-bold text-orange-900">{formatPrice(total)}</p>
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-orange-700"
      >
        {t("checkout.placeOrder")}
      </button>
    </form>
  );
}
