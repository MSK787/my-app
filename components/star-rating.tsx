"use client";

/** Simple 5-star rating renderer (read-only). */

import { useI18n } from "./i18n-context";

const STARS = [1, 2, 3, 4, 5];

export default function StarRating({
  rating,
  count,
}: {
  rating: number;
  count?: number;
}) {
  const { t } = useI18n();

  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={t("common.rated", { rating })}
    >
      <span className="text-sm tracking-tight text-orange-500" aria-hidden>
        {STARS.map((star) => (
          <span
            key={star}
            className={star <= Math.round(rating) ? "" : "opacity-25"}
          >
            ★
          </span>
        ))}
      </span>
      <span className="text-xs text-slate-500">
        {rating.toFixed(1)}
        {typeof count === "number" && ` (${count})`}
      </span>
    </div>
  );
}
