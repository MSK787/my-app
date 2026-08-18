/** Shipping rules for the whole store. */

export const FREE_SHIPPING_THRESHOLD = 500;
export const FLAT_SHIPPING_FEE = 25;

/** Shipping is free above the threshold; otherwise a flat fee applies. */
export function getShippingCost(subtotal: number): number {
  if (subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return FLAT_SHIPPING_FEE;
}
