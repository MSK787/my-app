"use client";

/**
 * Testimonials — three short customer stories with stars and avatars.
 * Static demo content, fully bilingual.
 */

import { useI18n } from "./i18n-context";
import Reveal from "./reveal";

const ITEMS = ["1", "2", "3"] as const;

export default function TestimonialsSection() {
  const { t } = useI18n();

  return (
    <Reveal>
      <section>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            {t("home.testimonialsTitle")}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{t("home.testimonialsHint")}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {ITEMS.map((id) => (
            <figure
              key={id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70"
            >
              <p className="text-sm tracking-tight text-orange-500" aria-hidden>
                ★★★★★
                <span className="sr-only">5 out of 5 stars</span>
              </p>
              <blockquote className="text-sm leading-7 text-slate-600">
                “{t(`testimonial.${id}.text`)}”
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-2">
                <span
                  aria-hidden
                  className="grid h-10 w-10 place-items-center rounded-full bg-orange-500 text-sm font-bold text-slate-900"
                >
                  {t(`testimonial.${id}.name`).charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">
                    {t(`testimonial.${id}.name`)}
                  </span>
                  <span className="block text-xs text-slate-500">
                    {t(`testimonial.${id}.role`)}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </Reveal>
  );
}
