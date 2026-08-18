/** Formats a number as a US-dollar price, e.g. 1299 -> "$1,299.00". */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
