"use client";

/**
 * "Deal of the week" — the product with the biggest discount, plus a live
 * countdown to Sunday midnight. Countdown ticks once per second; it is
 * display-only (no aria-live) so screen readers aren't spammed.
 *
 * HYDRATION CONTRACT: the deadline and current time must NEVER be computed
 * during render — the server would render its own clock and the client
 * would render a different one, producing a hydration mismatch (and a
 * deadline in the wrong timezone). Instead, the first render shows a
 * stable placeholder (identical on server and client); after mount, the
 * deadline is computed ON THE CLIENT and the timer starts ticking.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/products";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useI18n } from "./i18n-context";
import Reveal from "./reveal";
import AddToCartButton from "./add-to-cart-button";
import WhatsAppButton from "./whatsapp-button";

/** Discount fraction (0–1) of a product, or 0 without a compare price. */
function discountOf(product: Product): number {
  if (!product.compareAtPrice) return 0;
  return (product.compareAtPrice - product.price) / product.compareAtPrice;
}

/** Timestamp of next Sunday 23:59:59 — client-only (server timezones lie). */
function endOfWeek(): number {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const daysUntilSunday = (7 - now.getDay()) % 7;
  end.setDate(end.getDate() + daysUntilSunday);
  if (end.getTime() <= now.getTime()) end.setDate(end.getDate() + 7);
  return end.getTime();
}

const TIME_CELLS = [
  { unit: "d", labelKey: "time.days" },
  { unit: "h", labelKey: "time.hours" },
  { unit: "m", labelKey: "time.minutes" },
  { unit: "s", labelKey: "time.seconds" },
] as const;

export default function DealOfWeek() {
  const { t } = useI18n();

  // The deal = the product with the deepest discount.
  const deal = [...products]
    .filter((product) => product.compareAtPrice)
    .sort((a, b) => discountOf(b) - discountOf(a))[0];

  // NOTE: hooks must run before any early return — the deal lookup above
  // is pure data, but React's rules-of-hooks can't know that.
  //
  // `null` = "not mounted yet". First render (server AND client) shows the
  // same stable placeholder, so hydration always matches; the real
  // deadline/time are set after mount, on the client's own clock.
  const [end, setEnd] = useState<number | null>(null);
  const [now, setNow] = useState<number | null>(null);

  // After mount: take the client's clock (correct timezone), then start
  // ticking. Scheduled on the next frame so the state change happens in a
  // callback, not synchronously inside the effect body.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setEnd(endOfWeek());
      setNow(Date.now());
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  // Tick once per second — only once the deadline exists.
  useEffect(() => {
    if (end === null) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [end]);

  if (!deal) return null;

  const remaining =
    end !== null && now !== null ? Math.max(0, end - now) : null;
  const parts =
    remaining === null
      ? { d: null, h: null, m: null, s: null }
      : {
          d: Math.floor(remaining / 86_400_000),
          h: Math.floor(remaining / 3_600_000) % 24,
          m: Math.floor(remaining / 60_000) % 60,
          s: Math.floor(remaining / 1_000) % 60,
        };
  const saved = (deal.compareAtPrice ?? deal.price) - deal.price;
  const percent = Math.round(discountOf(deal) * 100);

  return (
    <Reveal>
      <section className="overflow-hidden rounded-3xl border border-amber-200 dark:border-amber-500/30 bg-gradient-to-br from-amber-50 dark:from-slate-900 via-white dark:via-slate-900 to-amber-50 dark:to-slate-800">
        <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
          {/* Copy + countdown */}
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-900 dark:bg-amber-500 px-4 py-1.5 text-xs font-bold text-white dark:text-slate-900">
              <span aria-hidden>⚡</span> {t("home.dealBadge")}
            </p>
            <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
              {deal.name}
            </h2>

            <div className="mt-3 flex flex-wrap items-baseline gap-3">
              <p className="text-4xl font-extrabold text-slate-900">
                {formatPrice(deal.price)}
              </p>
              {deal.compareAtPrice && (
                <p className="text-lg text-slate-500 dark:text-slate-400 line-through">
                  {formatPrice(deal.compareAtPrice)}
                </p>
              )}
              <span className="rounded-full border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-sm font-bold text-emerald-700">
                {t("home.dealSave", {
                  amount: formatPrice(saved),
                  percent,
                })}
              </span>
            </div>

            {/* Countdown */}
            <p className="mt-6 text-sm font-medium text-slate-500">
              ⏳ {t("home.dealEnds")}
            </p>
            <div className="mt-2 flex gap-2">
              {TIME_CELLS.map((cell) => (
                <div
                  key={cell.unit}
                  className="w-16 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 text-center shadow-sm"
                >
                  <p className="text-xl font-bold tabular-nums text-slate-900">
                    {parts[cell.unit] === null
                      ? "--"
                      : String(parts[cell.unit]).padStart(2, "0")}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
                    {t(cell.labelKey)}
                  </p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-7 flex flex-wrap gap-3">
              <AddToCartButton
                product={deal}
                className="rounded-full bg-slate-900 dark:bg-amber-500 px-6 py-3 text-sm font-semibold text-white dark:text-slate-900 transition hover:bg-amber-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              />
              <Link
                href={`/products/${deal.slug}`}
                className="rounded-full border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 transition hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 active:scale-[0.98]"
              >
                {t("home.dealCta")}
              </Link>
              <WhatsAppButton
                product={deal}
                className="grid h-12 w-12 place-items-center rounded-full bg-emerald-700 text-lg text-white transition hover:bg-emerald-800 active:scale-[0.98]"
              >
                💬
              </WhatsAppButton>
            </div>
          </div>

          {/* Image with discount badge */}
          <Link
            href={`/products/${deal.slug}`}
            className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800/60 shadow-lg shadow-amber-100"
          >
            <Image
              src={deal.image}
              alt={deal.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute start-4 top-4 rounded-full bg-slate-900 dark:bg-amber-500 px-4 py-1.5 text-sm font-extrabold text-white dark:text-slate-900 shadow">
              -{percent}%
            </span>
          </Link>
        </div>
      </section>
    </Reveal>
  );
}
