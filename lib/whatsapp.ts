/**
 * Builds WhatsApp order links: the customer taps a button and WhatsApp
 * opens with a pre-filled message — the same pattern eng-elec.com uses.
 * The message text follows the store's active language.
 */

import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { SITE } from "@/lib/site";

export function buildWhatsAppOrderLink(
  product: Product,
  lang: "en" | "ar" = "en"
): string {
  const lines =
    lang === "ar"
      ? [
          "مرحباً! أرغب بطلب هذا المنتج:",
          "",
          `*${product.name}*`,
          `السعر: ${formatPrice(product.price)}`,
          `الرابط: ${SITE.origin}/products/${product.slug}`,
          "",
          "شكراً جزيلاً!",
        ]
      : [
          "Hello! I'd like to order this product:",
          "",
          `*${product.name}*`,
          `Price: ${formatPrice(product.price)}`,
          `Link: ${SITE.origin}/products/${product.slug}`,
          "",
          "Thank you!",
        ];

  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
}
