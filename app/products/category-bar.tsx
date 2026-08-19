"use client";

/**
 * The store's category bar: ONE horizontal line — dropdown button +
 * category chips. On small screens it scrolls sideways (never wraps).
 */

import Link from "next/link";
import { useI18n } from "@/components/i18n-context";
import CategoryDropdown from "@/components/category-dropdown";
import { categories, getCategoryLabel } from "@/lib/products";

export default function CategoryBar({
  activeCategory,
}: {
  activeCategory: string;
}) {
  const { lang, t } = useI18n();

  return (
    <div className="no-scrollbar mt-6 flex items-center gap-2 overflow-x-auto">
      <CategoryDropdown />

      <Link
        href="/products"
        className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
          !activeCategory
            ? "border-slate-900 dark:border-amber-500 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900"
            : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400"
        }`}
      >
        {t("common.all")}
      </Link>

      {categories.map((category) => {
        const isActive = category.id === activeCategory;
        return (
          <Link
            key={category.id}
            href={`/products?category=${category.id}`}
            className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "border-slate-900 dark:border-amber-500 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-900"
                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400"
            }`}
          >
            {getCategoryLabel(category.id, lang)}
          </Link>
        );
      })}
    </div>
  );
}
