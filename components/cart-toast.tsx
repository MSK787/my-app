"use client";

/**
 * Cart toast: pops up briefly whenever a product is added to the cart
 * (listens for the "sunvolt:added" event fired by the cart context).
 * Includes a "View cart" shortcut. role="status" keeps it accessible.
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import { CART_ADD_EVENT } from "./cart-context";
import { useI18n } from "./i18n-context";

export default function CartToast() {
  const { t } = useI18n();
  const [toast, setToast] = useState<{ slug: string; id: number } | null>(null);

  // Listen for "added to cart" events.
  useEffect(() => {
    const handler = (event: Event) => {
      const slug = (event as CustomEvent<string>).detail;
      setToast({ slug, id: Date.now() });
    };
    window.addEventListener(CART_ADD_EVENT, handler);
    return () => window.removeEventListener(CART_ADD_EVENT, handler);
  }, []);

  // Auto-dismiss after a few seconds.
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;
  const product = getProductBySlug(toast.slug);
  if (!product) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4">
      <div
        key={toast.id}
        role="status"
        aria-live="polite"
        className="toast-in pointer-events-auto flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 shadow-xl shadow-slate-200/60"
      >
        <span
          aria-hidden
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-sm font-bold text-emerald-700"
        >
          ✓
        </span>
        <div className="min-w-0 max-w-72">
          <p className="truncate text-sm font-semibold text-slate-900">
            {t("toast.added", { name: product.name })}
          </p>
          <Link
            href="/cart"
            className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800"
          >
            {t("toast.viewCart")}
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setToast(null)}
          aria-label={t("common.close")}
          className="ms-2 grid h-7 w-7 place-items-center rounded-full text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
