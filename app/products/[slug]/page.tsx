/**
 * Product detail page — server shell.
 * The catalog is fixed data, so every product page is pre-rendered at
 * build time (generateStaticParams); the localized UI lives in
 * <ProductDetails>, which renders fully on the server too — no Suspense
 * skeleton, so crawlers and no-JS users get the complete page.
 *
 * NOTE: in Next.js 16, params is a Promise and must be awaited.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { filterProducts, getProductBySlug, products } from "@/lib/products";
import ProductDetails from "./product-details";

/** Pre-render one page per product at build time. */
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

/** Set the browser tab title per product. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  // Related = other products in the same category (up to 4).
  const related = filterProducts({ category: product.category })
    .filter((item) => item.slug !== product.slug)
    .slice(0, 4);

  return <ProductDetails product={product} related={related} />;
}
