"use client";

/**
 * Scroll-reveal wrapper: fades + slides content in the first time it
 * enters the viewport (IntersectionObserver). Content is visible by
 * default (SSR/no-JS safe); once JS mounts, the observer hides anything
 * below the fold and reveals it as it scrolls into view. The observer's
 * callbacks do the state changes — no synchronous setState in the effect.
 */

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

export default function Reveal({
  children,
  /** Extra transition delay in ms — use small steps to stagger grids. */
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // "visible" first: no-JS and SSR get fully visible content.
  const [state, setState] = useState<"visible" | "hidden">("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Users who prefer reduced motion see everything immediately.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // IntersectionObserver always fires once on observe(): elements in
    // view stay visible, elements below the fold become hidden here and
    // are revealed (with animation) when they scroll into view.
    const observer = new IntersectionObserver(
      ([entry]) => {
        setState(entry.isIntersecting ? "visible" : "hidden");
        if (entry.isIntersecting) observer.disconnect();
      },
      { threshold: 0.1, rootMargin: "0px 0px -32px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${
        state === "hidden" ? "reveal-hidden" : "reveal-visible"
      } ${className}`}
    >
      {children}
    </div>
  );
}
