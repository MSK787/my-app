"use client";

/**
 * Floating corner actions on every page:
 *   - WhatsApp chat bubble with a soft pulse ring
 *   - "Back to top" button that appears after scrolling
 * Both pinned bottom-end so they work in LTR and RTL layouts.
 */

import { useEffect, useState } from "react";
import { useI18n } from "./i18n-context";
import { SITE } from "@/lib/site";

export default function FloatingActions() {
  const { lang, t } = useI18n();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const message =
    lang === "ar"
      ? "مرحباً! لدي استفسار عن منتجاتكم."
      : "Hello! I have a question about your products.";

  return (
    <div className="fixed bottom-5 end-5 z-40 flex flex-col items-center gap-3">
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label={t("common.backToTop")}
          className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 bg-white text-lg text-slate-700 shadow-lg shadow-slate-200/60 transition hover:border-amber-400 hover:text-amber-700"
        >
          ↑
        </button>
      )}

      <a
        href={`https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("common.chatWhatsapp")}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-emerald-700 text-2xl text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-800"
      >
        {/* Soft pulse ring behind the bubble */}
        <span
          aria-hidden
          className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-40"
        />
        💬
      </a>
    </div>
  );
}
