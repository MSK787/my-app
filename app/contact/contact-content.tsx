"use client";

/**
 * Contact page content: contact info cards, the (demo) contact form and
 * two info panels. All labels follow the active language.
 */

import { useI18n } from "@/components/i18n-context";
import ContactForm from "@/components/contact-form";
import FaqAccordion from "@/components/faq-accordion";
import { SITE } from "@/lib/site";

export default function ContactContent() {
  const { t } = useI18n();

  const channels = [
    { emoji: "📞", title: t("contact.phone"), lines: [SITE.phone, SITE.hours] },
    {
      emoji: "📧",
      title: t("contact.email"),
      lines: [SITE.email, t("contact.emailNote")],
    },
    {
      emoji: "📍",
      title: t("contact.showroom"),
      lines: [SITE.address, t("contact.showroomNote")],
    },
    {
      emoji: "💬",
      title: t("contact.whatsapp"),
      lines: [`+${SITE.whatsappNumber}`, t("contact.whatsappNote")],
    },
  ];

  const whyList = [
    t("contact.why1"),
    t("contact.why2"),
    t("contact.why3"),
    t("contact.why4"),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">{t("contact.title")}</h1>
      <p className="mt-1 max-w-xl text-sm text-slate-500">{t("contact.hint")}</p>

      {/* Contact channels */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {channels.map((channel) => (
          <div
            key={channel.title}
            className="rounded-2xl border border-slate-200 bg-white p-5"
          >
            <p className="text-2xl" aria-hidden>
              {channel.emoji}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {channel.title}
            </p>
            {channel.lines.map((line) => (
              <p key={line} className="mt-0.5 text-sm text-slate-500">
                {line}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* Form + info panels */}
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            {t("contact.sendMessage")}
          </h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-slate-900 p-8 text-white">
            <h2 className="text-lg font-semibold">{t("contact.whyTitle")}</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              {whyList.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8">
            <h2 className="text-lg font-semibold text-amber-900">
              {t("contact.hours")}
            </h2>
            <p className="mt-2 text-sm text-amber-800">{t("contact.hoursText")}</p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-14">
        <FaqAccordion />
      </div>
    </div>
  );
}
