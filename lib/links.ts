/** Shared link builders. */

/** "Buy now" link: adds the product to the cart and opens checkout. */
export function buildBuyNowUrl(slug: string, quantity = 1): string {
  const params = new URLSearchParams({
    add: slug,
    qty: String(quantity),
  });
  return `/checkout?${params.toString()}`;
}
