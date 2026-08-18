/**
 * Store-wide contact details and settings.
 * Everything here is demo data — swap in the real values when needed.
 *
 * The public site URL comes from NEXT_PUBLIC_SITE_URL (see .env.example)
 * and falls back to a placeholder domain. Set it before publishing so
 * sitemap.xml, robots.txt, metadata and WhatsApp links use the real domain.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sunvolt.example";

export const SITE = {
  name: "Aleppo Power",
  /** Public base URL of the store — no trailing slash. */
  origin: BASE_URL,
  /** Phone shown in the top bar and footer. */
  phone: "+31 20 123 4567",
  phoneHref: "tel:+31201234567",
  email: "hello@sunvolt.example",
  /** WhatsApp number in international format, digits only. */
  whatsappNumber: "31612345678",
  address: "Energy Street 12, 1012 AB Amsterdam",
  hours: "Mon–Sat, 9:00–18:00",
};
