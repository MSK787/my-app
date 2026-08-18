"use client";

/**
 * Site header — the living face of the store:
 *   1. Top bar       — shipping note + contact info (desktop only)
 *   2. Main bar      — logo, search, language switcher, cart (sticky)
 *   3. Nav bar       — animated underline links + "Shop" mega-dropdown
 * Plus an animated slide-down mobile menu with search + language switcher.
 *
 * Motion details (all disabled under prefers-reduced-motion):
 *   - Nav links draw an amber underline on hover; the active page keeps it.
 *   - The "Shop" panel pops in with a slight overshoot and its items fade
 *     up one by one; categories have icons + counts and there's a featured
 *     product mini-card on the right.
 *   - The cart icon wiggles on hover; the badge pops when items are added.
 *
 * The dropdown opens on hover, focus, AND tap, and closes on outside
 * click, Escape, or focus leaving. Positioning uses logical properties so
 * it stays on-screen in RTL too.
 */

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "./cart-context";
import { useI18n } from "./i18n-context";
import LanguageSwitcher from "./language-switcher";
import SchemeToggle from "./scheme-toggle";
import {
  CATEGORY_EMOJIS,
  QUICK_FILTERS,
  categories,
  countProductsByCategory,
  filterProducts,
} from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/shipping";
import { SITE } from "@/lib/site";

const NAV_LINKS = [
  { href: "/", labelKey: "nav.home" },
  { href: "/products", labelKey: "nav.shop" },
  { href: "/products?category=solar-panels", labelKey: "nav.solarPanels" },
  { href: "/products?category=inverters", labelKey: "nav.inverters" },
  { href: "/products?category=batteries", labelKey: "nav.batteries" },
  { href: "/contact", labelKey: "nav.contact" },
];

/** Which nav link counts as "active" for the current path. */
function isLinkActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  // Every page under /products belongs to the "Shop" section.
  if (href === "/products") return pathname.startsWith("/products");
  return pathname === href;
}

/** Quick-browse dictionary key for a filter id (new / best-sellers / featured). */
function quickFilterLabelKey(id: string): string {
  if (id === "new") return "header.newArrivals";
  if (id === "best-sellers") return "header.bestSellers";
  return "header.featured";
}

/**
 * Animated underline for a nav link: hidden, slides in on hover, and
 * stays visible when the page is active. Slides from the correct side
 * in RTL (logical origin).
 */
function NavUnderline({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={`absolute inset-x-3 bottom-1 h-0.5 origin-left rounded-full bg-amber-500 transition-transform duration-300 ease-out rtl:origin-right ${
        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
    />
  );
}

/** One menu item with a staggered entrance animation. */
function MenuRow({
  delay,
  children,
  className = "",
}: {
  delay: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`menu-item ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/**
 * The mega-panel under "Shop": categories with icons and counts on the
 * left; quick-browse links plus a featured product mini-card on the right.
 */
function ShopDropdown({ isActive }: { isActive: boolean }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const counts = countProductsByCategory();
  const featured = filterProducts({ filter: "featured" })[0];
  const close = useCallback(() => setOpen(false), []);

  // Close on Escape while the dropdown is open.
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  return (
    <div
      className="group relative"
      // Pointer opens/closes (desktop hover), focus opens/closes (keyboard).
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      {/* Trigger — a button so touch users can open it too */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-current={isActive ? "page" : undefined}
        className={`relative flex items-center gap-1 px-4 py-3 text-sm font-medium transition ${
          isActive ? "text-amber-700 dark:text-amber-400" : "text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400"
        }`}
      >
        {t("nav.shop")}
        <span
          className={`text-xs text-slate-500 dark:text-slate-400 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden
        >
          ▾
        </span>
        <NavUnderline active={isActive} />
      </button>

      {open && (
        <>
          {/* Click-anywhere backdrop to close (under the panel) */}
          <button
            type="button"
            aria-label={t("common.close")}
            onClick={close}
            className="fixed inset-0 z-40 cursor-default"
          />

          {/* Panel — start-0 keeps it on-screen in both LTR and RTL */}
          <div className="menu-panel absolute start-0 top-full z-50 w-[600px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/60">
            <div className="grid sm:grid-cols-2">
              {/* Left: categories with icons + counts */}
              <div className="border-b border-slate-100 dark:border-slate-800 p-6 sm:border-b-0 sm:border-e">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {t("header.categories")}
                </p>
                <ul className="mt-3 space-y-1">
                  {categories.map((category, index) => (
                    <MenuRow key={category.id} delay={index * 35}>
                      <Link
                        href={`/products?category=${category.id}`}
                        onClick={close}
                        className="group/item flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-600 dark:text-slate-300 transition hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-800"
                      >
                        <span
                          aria-hidden
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 dark:bg-slate-800/60 text-base transition-transform duration-200 group-hover/item:scale-110"
                        >
                          {CATEGORY_EMOJIS[category.id]}
                        </span>
                        <span className="flex-1 font-medium">{category.name}</span>
                        <span className="text-xs font-semibold text-slate-500">
                          {counts[category.id] ?? 0}
                        </span>
                      </Link>
                    </MenuRow>
                  ))}
                </ul>
              </div>

              {/* Right: quick browse + featured product mini-card */}
              <div className="flex flex-col gap-4 p-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t("header.quickBrowse")}
                  </p>
                  <ul className="mt-3 space-y-1">
                    {QUICK_FILTERS.map((filter, index) => (
                      <MenuRow key={filter.id} delay={120 + index * 35}>
                        <Link
                          href={`/products?filter=${filter.id}`}
                          onClick={close}
                          className="block rounded-lg px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 transition hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-800"
                        >
                          {t(quickFilterLabelKey(filter.id))}
                        </Link>
                      </MenuRow>
                    ))}
                    <MenuRow delay={240}>
                      <Link
                        href="/products"
                        onClick={close}
                        className="block rounded-lg px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 transition hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-800"
                      >
                        {t("header.allProducts")}
                      </Link>
                    </MenuRow>
                  </ul>
                </div>

                {/* Featured product mini-card */}
                {featured && (
                  <MenuRow delay={280}>
                    <Link
                      href={`/products/${featured.slug}`}
                      onClick={close}
                      className="group/card flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-3 transition hover:border-amber-300 hover:bg-amber-50"
                    >
                      <span className="relative block h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-white">
                        <Image
                          src={featured.image}
                          alt={featured.name}
                          fill
                          sizes="56px"
                          className="object-cover transition duration-300 group-hover/card:scale-110"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-900">
                          {featured.name}
                        </span>
                        <span className="block text-sm font-bold text-amber-700">
                          {formatPrice(featured.price)}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className="text-slate-400 dark:text-slate-500 transition-transform duration-200 group-hover/card:translate-x-0.5 rtl:group-hover/card:-translate-x-0.5"
                      >
                        →
                      </span>
                    </Link>
                  </MenuRow>
                )}

                <Link
                  href="/products"
                  onClick={close}
                  className="mt-auto inline-block rounded-full bg-slate-900 dark:bg-amber-500 px-5 py-2.5 text-center text-xs font-semibold text-white dark:text-slate-900 transition hover:bg-amber-700 active:scale-[0.98]"
                >
                  {t("header.viewAll")}
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function SiteHeader() {
  const { itemCount } = useCart();
  const { t } = useI18n();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header>
      {/* Skip link — first focusable element, jumps straight to <main>. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-slate-900 dark:bg-amber-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white dark:text-slate-900"
      >
        {t("nav.skipToContent")}
      </a>

      {/* 1. Top bar */}
      <div className="hidden bg-slate-900 dark:bg-slate-800 text-xs text-slate-300 sm:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-4 sm:px-6">
          <p>
            🚚{" "}
            {t("topbar.freeShipping", { amount: `$${FREE_SHIPPING_THRESHOLD}` })}
          </p>
          <div className="flex items-center gap-5">
            <a href={SITE.phoneHref} className="transition hover:text-amber-400">
              📞 {SITE.phone}
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="transition hover:text-amber-400"
            >
              📧 {SITE.email}
            </a>
            <a
              href={`https://wa.me/${SITE.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-400 transition hover:text-emerald-300"
            >
              💬 {t("contact.whatsapp")}
            </a>
          </div>
        </div>
      </div>

      {/* 2 + 3. Sticky main bar and nav bar */}
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 transition hover:opacity-90 active:scale-[0.98]"
          >
            <img
              src="/images/logo.png"
              alt="Aleppo Power"
              className="h-11 w-auto md:h-12 dark:[filter:brightness(0)_invert(1)]"
            />
          </Link>

          {/* Header search — submits to the store page */}
          <form action="/products" className="hidden flex-1 justify-center md:flex">
            <div className="relative w-full max-w-md">
              <label htmlFor="header-search" className="sr-only">
                {t("common.search")}
              </label>
              <input
                id="header-search"
                type="text"
                name="query"
                placeholder={t("header.searchPlaceholder")}
                className="w-full rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 py-2.5 ps-5 pe-12 text-sm shadow-sm outline-none transition focus:border-amber-500 focus:bg-white focus:shadow-md"
              />
              <button
                type="submit"
                aria-label={t("common.search")}
                className="absolute end-1.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-amber-500 text-sm text-slate-900 dark:text-slate-100 transition hover:bg-amber-600 active:scale-95"
              >
                🔍
              </button>
            </div>
          </form>

          <div className="ms-auto flex items-center gap-2">
            {/* Language switcher + color scheme */}
            <div className="flex items-center gap-1.5">
              <LanguageSwitcher />
              <SchemeToggle />
            </div>

            {/* Cart (icon wiggles on hover) */}
            <Link
              href="/cart"
              className="cart-bump relative flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-amber-400 hover:text-amber-700 dark:hover:text-amber-400 active:scale-[0.98]"
            >
              <span aria-hidden className="cart-bump-icon inline-block">
                🛒
              </span>
              <span className="hidden sm:inline">{t("header.cart")}</span>
              {itemCount > 0 && (
                <span
                  key={itemCount}
                  className="animate-badge-pop absolute -end-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-amber-500 px-1 text-xs font-bold text-slate-900"
                >
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={t("header.toggleMenu")}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 dark:border-slate-800 text-lg text-slate-700 dark:text-slate-300 transition hover:border-amber-400 hover:text-amber-700 dark:hover:text-amber-400 active:scale-95 md:hidden"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav
          aria-label={t("nav.aria")}
          className="hidden border-t border-slate-100 dark:border-slate-800 md:block"
        >
          <div className="mx-auto flex max-w-7xl items-center px-4 sm:px-6">
            {NAV_LINKS.map((link) => {
              const isActive = isLinkActive(pathname, link.href);
              // "Shop" gets the mega-dropdown (button trigger).
              if (link.labelKey === "nav.shop") {
                return <ShopDropdown key={link.href} isActive={isActive} />;
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400"
                  }`}
                >
                  {t(link.labelKey)}
                  <NavUnderline active={isActive} />
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Mobile menu (slides down on open) */}
      {menuOpen && (
        <div id="mobile-menu" className="menu-slide border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 md:hidden">
          <div className="mx-auto max-w-7xl space-y-5 px-4 py-5 sm:px-6">
            {/* Mobile search */}
            <form action="/products" className="flex gap-2">
              <label htmlFor="mobile-search" className="sr-only">
                {t("common.search")}
              </label>
              <input
                id="mobile-search"
                type="text"
                name="query"
                placeholder={t("header.searchPlaceholder")}
                className="w-full rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 px-4 py-2.5 text-sm outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                aria-label={t("common.search")}
                className="rounded-full bg-amber-500 px-4 text-sm text-slate-900"
              >
                🔍
              </button>
            </form>

            {/* Page links */}
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 transition hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-700"
                  >
                    {t(link.labelKey)}
                    <span
                      aria-hidden
                      className="inline-block text-xs text-slate-500 dark:text-slate-400 rtl:rotate-180"
                    >
                      ‹
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Categories with icons */}
            <div>
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {t("header.categories")}
              </p>
              <ul className="mt-1 grid grid-cols-2 gap-1">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/products?category=${category.id}`}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 dark:text-slate-300 transition hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:text-amber-700"
                    >
                      <span aria-hidden>{CATEGORY_EMOJIS[category.id]}</span>
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Language + scheme (also available on mobile) */}
            <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 px-4 py-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {t("header.language")} · {t("scheme.label")}
              </span>
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <SchemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
