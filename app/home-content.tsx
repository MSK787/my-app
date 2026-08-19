"use client";

/**
 * Home page content: hero, brand marquee, feature strip, category cards,
 * deal of the week with countdown, tabbed quick-browse rail, stats band,
 * testimonials, our-pick spotlight and a quote CTA.
 * A client component so every label follows the active language.
 */

import Link from "next/link";
import Image from "next/image";
import { categories, filterProducts, getCategoryLabel } from "@/lib/products";
import { useI18n } from "@/components/i18n-context";
import Reveal from "@/components/reveal";
import BrandMarquee from "@/components/brand-marquee";
import DealOfWeek from "@/components/deal-of-week";
import StatsSection from "@/components/stats-section";
import TestimonialsSection from "@/components/testimonials-section";
import QuickBrowseTabs from "@/components/quick-browse-tabs";

// Four catalog photos shown as a collage in the hero (right column).
const HERO_IMAGES = [
  { src: "/images/panel-mono-550.jpg", alt: "Solar panel" },
  { src: "/images/battery-lifepo4.jpg", alt: "Lithium battery" },
  { src: "/images/inverter-hybrid.jpg", alt: "Hybrid inverter" },
  { src: "/images/mppt-controller.jpg", alt: "MPPT charge controller" },
];

function FeatureStrip() {
  const { t } = useI18n();
  const features = [
    { emoji: "🚚", title: t("home.feature1Title"), text: t("home.feature1Text") },
    { emoji: "🛡️", title: t("home.feature2Title"), text: t("home.feature2Text") },
    { emoji: "🛠️", title: t("home.feature3Title"), text: t("home.feature3Text") },
    { emoji: "💳", title: t("home.feature4Title"), text: t("home.feature4Text") },
  ];

  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 text-center transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70"
        >
          <p className="text-2xl" aria-hidden>
            {feature.emoji}
          </p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{feature.title}</p>
          <p className="mt-0.5 text-xs text-slate-500">{feature.text}</p>
        </div>
      ))}
    </section>
  );
}

function CategorySection() {
  const { lang, t } = useI18n();

  return (
    <section>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t("home.shopByCategory")}</h2>
          <p className="mt-1 text-sm text-slate-500">{t("home.categoryHint")}</p>
        </div>
        <Link
          href="/products"
          className="hidden text-sm font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 sm:block"
        >
          {t("home.viewAll")}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((category, index) => (
          <Reveal key={category.id} delay={index * 50}>
            <Link
              href={`/products?category=${category.id}`}
              className="group block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(min-width: 1024px) 16vw, 50vw"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-amber-700">
                  {getCategoryLabel(category.id, lang)}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                  {lang === "ar" ? category.descriptionAr : category.description}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** One highlighted "our pick" card from the featured list. */
function HighlightedProduct() {
  const { t } = useI18n();
  const product = filterProducts({ filter: "featured" })[0];
  if (!product) return null;

  return (
    <section className="grid items-center gap-8 rounded-3xl bg-slate-900 dark:bg-slate-800 p-6 sm:p-10 lg:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
          {t("home.ourPick")}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          {product.name}
        </h2>
        <ul className="mt-4 space-y-2">
          {product.highlights.slice(0, 3).map((highlight) => (
            <li key={highlight} className="flex gap-2 text-sm text-slate-300">
              <span className="text-amber-400" aria-hidden>
                ⚡
              </span>
              {highlight}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href={`/products/${product.slug}`}
            className="rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 transition hover:bg-amber-400 active:scale-[0.98]"
          >
            {t("home.viewProduct")}
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            {t("home.browseStore")}
          </Link>
        </div>
      </div>
      <Link
        href={`/products/${product.slug}`}
        className="group relative block aspect-video overflow-hidden rounded-2xl bg-slate-800"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </Link>
    </section>
  );
}

/** Closing CTA: free system sizing by engineers. */
function QuoteSection() {
  const { t } = useI18n();

  return (
    <section className="rounded-3xl bg-slate-900 dark:bg-slate-800 px-6 py-12 text-center sm:px-12">
      <h2 className="text-2xl font-bold text-white">{t("home.quoteTitle")}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-300">
        {t("home.quoteText")}
      </p>
      <Link
        href="/contact"
        className="mt-6 inline-block rounded-full bg-amber-500 px-6 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 transition hover:bg-amber-400 active:scale-[0.98]"
      >
        {t("home.askQuote")}
      </Link>
    </section>
  );
}

export default function HomeContent() {
  const { t } = useI18n();

  return (
    <>
      {/* Hero — animated gradient background + entrance animation */}
      <section className="hero-gradient relative overflow-hidden border-b border-amber-100">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div className="animate-fade-up">
            <p className="inline-block rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-700">
              {t("home.badge")}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100 md:text-5xl">
              {t("home.heroLead")}
              <span className="text-amber-600">{t("home.heroAccent")}</span>
              {t("home.heroTail")}
            </h1>
            <p className="mt-4 max-w-md text-slate-600">{t("home.heroSubtitle")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-full bg-slate-900 dark:bg-amber-500 px-6 py-3 text-sm font-semibold text-white dark:text-slate-900 transition hover:bg-amber-700 active:scale-[0.98]"
              >
                {t("home.shopAll")}
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-slate-900 px-6 py-3 text-sm font-semibold text-slate-900 dark:text-slate-100 transition hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-400 active:scale-[0.98]"
              >
                {t("home.talkEngineer")}
              </Link>
            </div>
            {/* Social proof line */}
            <p className="mt-5 flex items-center gap-2 text-sm text-slate-600">
              <span aria-hidden className="tracking-tight text-amber-500">
                ★★★★★
              </span>
              {t("home.heroRating")}
            </p>
          </div>

          {/* Hero collage — a 2×2 grid of catalog photos */}
          <div className="relative hidden md:block animate-fade-up [animation-delay:150ms]">
            <div className="grid grid-cols-2 gap-3">
              {HERO_IMAGES.map((image) => (
                <div
                  key={image.src}
                  className="relative aspect-square overflow-hidden rounded-3xl border-4 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-800/60 shadow-xl shadow-amber-200/50"
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 768px) 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="animate-float absolute -bottom-4 -start-4 rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-white dark:bg-slate-900 px-5 py-3 shadow-lg">
              <p className="text-xs text-slate-500">{t("home.startingFrom")}</p>
              <p className="text-xl font-bold text-slate-900">$189</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brands ticker */}
      <BrandMarquee />

      <div className="mx-auto max-w-7xl space-y-16 px-4 py-14 sm:px-6">
        <Reveal>
          <FeatureStrip />
        </Reveal>

        <CategorySection />

        <DealOfWeek />

        <QuickBrowseTabs />

        <StatsSection />

        <TestimonialsSection />

        <Reveal>
          <HighlightedProduct />
        </Reveal>

        <Reveal>
          <QuoteSection />
        </Reveal>
      </div>
    </>
  );
}
