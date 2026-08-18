"use client";

/**
 * Cart state for the whole store.
 *
 * The cart lives in localStorage so it survives page reloads. State is
 * managed with useSyncExternalStore — the idiomatic React way to sync
 * with an external store (no setState-inside-effect, no hydration
 * mismatch). Cart lines only store the product slug + quantity; prices
 * always come from lib/products.ts, so a price edit in the catalog is
 * immediately reflected everywhere.
 */

import { createContext, useContext, useSyncExternalStore } from "react";
import type { ReactNode } from "react";
import type { CartLine } from "@/lib/cart";
import { getProductBySlug, type Product } from "@/lib/products";

const STORAGE_KEY = "sunvolt-cart";

/** Custom event fired whenever a product is added (used by the cart toast). */
export const CART_ADD_EVENT = "sunvolt:added";

// ---------------------------------------------------------------------------
// The store itself: a tiny localStorage-backed observable.
//
// useSyncExternalStore REQUIRES getSnapshot to return the SAME reference
// until the data changes — otherwise React re-renders forever ("Maximum
// update depth exceeded"). Reads are therefore cached: localStorage is
// parsed only when the raw string actually changed (a write from this tab,
// or a "storage" event from another).
// ---------------------------------------------------------------------------

const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();

/** Snapshot cache — the key to a stable getSnapshot. */
let cachedRaw: string | null = null;
let cachedValue: CartLine[] = EMPTY;

function notify() {
  listeners.forEach((listener) => listener());
}

/** Parses one raw cart string into lines (validated). */
function parseCart(raw: string): CartLine[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    // Only accept a real array — never trust storage blindly.
    if (Array.isArray(parsed)) return parsed as CartLine[];
  } catch {
    // Corrupt storage — fall through to an empty cart.
  }
  return EMPTY;
}

/** Reads the cart from localStorage (client only) — cached and stable. */
function readCart(): CartLine[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage blocked (private mode) — treat as empty.
  }
  if (raw === cachedRaw) return cachedValue; // unchanged → SAME reference
  cachedRaw = raw;
  cachedValue = raw === null ? EMPTY : parseCart(raw);
  return cachedValue;
}

/** Replaces the cart, persists it, and notifies subscribers. */
function writeCart(next: CartLine[]) {
  // Write through the cache so the next getSnapshot is stable immediately.
  cachedRaw = JSON.stringify(next);
  cachedValue = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch {
    // Storage full or blocked — the in-memory cart still works.
  }
  notify();
}

/** Keep other open tabs in sync. */
function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

interface CartContextValue {
  /** Cart lines, newest last. */
  lines: CartLine[];
  /** Total number of items (sum of quantities). */
  itemCount: number;
  /** Total price of everything in the cart. */
  subtotal: number;
  addItem: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // Client snapshot = localStorage; server snapshot = empty (SSR-safe).
  const current = useSyncExternalStore(subscribe, readCart, () => EMPTY);

  function addItem(slug: string, quantity = 1) {
    writeCart(
      current.some((line) => line.productSlug === slug)
        ? current.map((line) =>
            line.productSlug === slug
              ? { ...line, quantity: line.quantity + quantity }
              : line
          )
        : [...current, { productSlug: slug, quantity }]
    );
    // Let the toast know something was just added.
    window.dispatchEvent(new CustomEvent<string>(CART_ADD_EVENT, { detail: slug }));
  }

  function setQuantity(slug: string, quantity: number) {
    writeCart(
      quantity <= 0
        ? current.filter((line) => line.productSlug !== slug)
        : current.map((line) =>
            line.productSlug === slug ? { ...line, quantity } : line
          )
    );
  }

  function removeItem(slug: string) {
    writeCart(current.filter((line) => line.productSlug !== slug));
  }

  function clear() {
    writeCart(EMPTY);
  }

  // Derived values, computed fresh from the current snapshot.
  let itemCount = 0;
  let subtotal = 0;
  for (const line of current) {
    const product = getProductBySlug(line.productSlug);
    itemCount += line.quantity;
    if (product) subtotal += product.price * line.quantity;
  }

  const value: CartContextValue = {
    lines: current,
    itemCount,
    subtotal,
    addItem,
    setQuantity,
    removeItem,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Hook for reading/writing the cart. Must be used inside <CartProvider>. */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside <CartProvider>");
  }
  return context;
}

/** Resolves a cart line to its product. Returns null if the product no longer exists. */
export function lineProduct(line: CartLine): Product | null {
  return getProductBySlug(line.productSlug) ?? null;
}
