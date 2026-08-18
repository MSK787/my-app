"use client";

/**
 * Tabbed product rail on the home page, mirroring the reference store's
 * quick-browse section: Featured / New arrivals / Best sellers.
 */

import { useState } from "react";
import Link from "next/link";
import { filterProducts } from "@/lib/products";
import { useI18n } from "./i18n-context";
import Reveal from "./reveal";
import ProductCard from "./product-card";

const TABS = [
  { id: "featured", labelKey: "home.tabsFeatured" },
  { id: "new", labelKey: "home.tabsNew" },
  { id: "best-sellers", labelKey: "home.tabsBestSellers" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function QuickBrowseTabs() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<TabId>("featured");

  // Four products from the active quick-browse list.
  const products = filterProducts({ filter: activeTab }).slice(0, 4);

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {t("home.quickBrowse")}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{t("home.quickBrowseHint")}</p>
        </div>
        <Link
          href={`/products?filter=${activeTab}`}
          className="hidden text-sm font-semibold text-amber-700 hover:text-amber-700 sm:block"
        >
          {t("home.viewAll")}
        </Link>
      </div>

      {/* Tab buttons */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-pressed={isActive}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 text-slate-600 hover:border-slate-400"
              }`}
            >
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product, index) => (
          <Reveal key={product.slug} delay={(index % 4) * 60}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
