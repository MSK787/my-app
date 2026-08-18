"use client";

/**
 * Add-to-cart button with a short "✓ Added" confirmation.
 * Accepts an extra className so each caller can style it its own way.
 */

import { useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "./cart-context";
import { useI18n } from "./i18n-context";

export default function AddToCartButton({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const { addItem } = useCart();
  const { t } = useI18n();
  // "added" flashes true for a moment so the user sees a confirmation.
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(product.slug);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={product.stock === "out"}
      className={className}
    >
      {product.stock === "out"
        ? t("common.soldOut")
        : added
          ? t("common.added")
          : t("common.addToCart")}
    </button>
  );
}
