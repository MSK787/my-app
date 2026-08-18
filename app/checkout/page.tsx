/**
 * Checkout page.
 *
 * The actual checkout UI lives in <CheckoutContent>, which reads URL
 * search params (?add=…&qty=… for the "Buy now" flow). Because
 * useSearchParams() forces client rendering, it must be wrapped in a
 * Suspense boundary — otherwise Next.js can't pre-render this route.
 */

import { Suspense } from "react";
import CheckoutContent from "./checkout-content";

/** Simple placeholder shown while the checkout client component loads.
 *  The h1 keeps the page meaningful to crawlers and during hydration. */
function CheckoutFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutContent />
    </Suspense>
  );
}
