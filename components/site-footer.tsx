"use client";

/**
 * Site footer: brand + contact info, company links, category links,
 * a (demo) newsletter signup, and payment-method badges at the bottom.
 * All labels come from the i18n dictionary (English / Arabic).
 */

import Link from "next/link";
import { useI18n } from "./i18n-context";
import NewsletterForm from "./newsletter-form";
import { categories } from "@/lib/products";
import { SITE } from "@/lib/site";

const COMPANY_LINKS = [
  { href: "/", labelKey: "nav.home" },
  { href: "/products", labelKey: "footer.shopAll" },
  { href: "/products?filter=new", labelKey: "footer.newArrivals" },
  { href: "/products?filter=best-sellers", labelKey: "footer.bestSellers" },
  { href: "/cart", labelKey: "footer.cart" },
  { href: "/contact", labelKey: "footer.contactUs" },
];

const PAYMENT_METHODS = [
  "Visa",
  "Mastercard",
  "PayPal",
  "Bank transfer",
  "Cash on delivery",
];

export default function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand + contact info */}
        <div>
          <div className="flex items-center gap-2.5">
            <img
              src="/images/logo.png"
              alt="Aleppo Power"
              width={44}
              height={44}
              className="h-11 w-11 rounded-lg"
            />
            <p className="text-lg font-bold text-slate-900">Aleppo Power</p>
          </div>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">
            {t("footer.about")}
          </p>
          <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
            <li>
              <a href={SITE.phoneHref} className="transition hover:text-orange-700">
                📞 {SITE.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="transition hover:text-orange-700"
              >
                📧 {SITE.email}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${SITE.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-emerald-600"
              >
                💬 {t("contact.whatsapp")}
              </a>
            </li>
            <li>📍 {SITE.address}</li>
            <li>🕘 {SITE.hours}</li>
          </ul>
        </div>

        {/* Company links */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            {t("footer.company")}
          </p>
          <ul className="mt-3 space-y-2">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-slate-600 transition hover:text-orange-700"
                >
                  {t(link.labelKey)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            {t("footer.categories")}
          </p>
          <ul className="mt-3 space-y-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/products?category=${category.id}`}
                  className="text-sm text-slate-600 transition hover:text-orange-700"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-900">
            {t("newsletter.title")}
          </p>
          <p className="mt-3 text-sm text-slate-600">{t("newsletter.hint")}</p>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Bottom bar: copyright + payment methods */}
      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <p className="text-xs text-slate-500">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex flex-wrap gap-2">
            {PAYMENT_METHODS.map((method) => (
              <span
                key={method}
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-slate-500"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
