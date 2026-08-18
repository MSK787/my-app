"use client";

/**
 * Animated statistics band. Numbers count up from zero the first time
 * the section scrolls into view (skipped under prefers-reduced-motion).
 */

import { useEffect, useRef, useState } from "react";
import { products } from "@/lib/products";
import { useI18n } from "./i18n-context";
import Reveal from "./reveal";

/** Counts from 0 to `target` once the element becomes visible. */
function useCountUp(target: number) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion → jump straight to the final number. Scheduled on the
    // next frame so the state change happens in a callback, not the effect.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frame = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const duration = 1600;
        const start = performance.now();
        const tick = (time: number) => {
          const progress = Math.min(1, (time - start) / duration);
          // easeOutCubic for a satisfying deceleration.
          setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return { ref, value };
}

function StatCell({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const { ref, value: current } = useCountUp(value);

  return (
    <div>
      <p
        ref={ref}
        className="text-3xl font-extrabold tabular-nums text-white sm:text-4xl"
      >
        {current.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-1 text-sm text-slate-300">{label}</p>
    </div>
  );
}

export default function StatsSection() {
  const { t } = useI18n();

  const stats = [
    { value: 8500, suffix: "+", label: t("home.statCustomers") },
    { value: products.filter((p) => p.stock !== "out").length, suffix: "+", label: t("home.statProducts") },
    { value: 12, suffix: "+", label: t("home.statYears") },
    { value: 98, suffix: "%", label: t("home.statSatisfaction") },
  ];

  return (
    <Reveal>
      <section
        aria-label={t("home.statsLabel")}
        className="rounded-3xl bg-slate-900 px-6 py-10 sm:py-12"
      >
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <StatCell key={stat.label} {...stat} />
          ))}
        </div>
      </section>
    </Reveal>
  );
}
