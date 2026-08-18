"use client";

/**
 * "Order via WhatsApp" link — the reference store's favorite order method.
 * Opens WhatsApp with a pre-filled message (product, price, link) in the
 * store's active language. The phone number is a demo placeholder in
 * lib/site.ts.
 */

import type { ReactNode } from "react";
import type { Product } from "@/lib/products";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";
import { useI18n } from "./i18n-context";

export default function WhatsAppButton({
  product,
  className = "",
  children,
}: {
  product: Product;
  className?: string;
  children?: ReactNode;
}) {
  const { lang, t } = useI18n();

  return (
    <a
      href={buildWhatsAppOrderLink(product, lang)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("common.orderWhatsapp")}
      className={className}
    >
      {children ?? t("common.orderWhatsapp")}
    </a>
  );
}
