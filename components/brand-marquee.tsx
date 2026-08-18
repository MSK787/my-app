"use client";

/**
 * Endless brand ticker under the hero — a classic "real store" touch.
 * The track renders the brand list twice and slides left forever; it
 * pauses on hover and stops completely under prefers-reduced-motion.
 */

import { useI18n } from "./i18n-context";

// Well-known brands in the solar/electrical space (text marquee, demo only).
const BRANDS = [
  "LONGi",
  "JinkoSolar",
  "Victron Energy",
  "Growatt",
  "Pylontech",
  "Huawei FusionSolar",
  "Schneider Electric",
  "Trina Solar",
  "Deye",
  "BYD",
  "Fronius",
  "SMA",
];

export default function BrandMarquee() {
  const { t } = useI18n();

  return (
    <section
      aria-label={t("home.brandsTitle")}
      className="border-y border-slate-800 bg-slate-900 py-5"
    >
      <div className="marquee">
        <div className="marquee-track gap-10">
          {[...BRANDS, ...BRANDS].map((brand, index) => (
            <span
              key={`${brand}-${index}`}
              className="flex items-center gap-3 whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-slate-400"
            >
              <span aria-hidden className="text-amber-500">
                ✦
              </span>
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
