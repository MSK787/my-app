/**
 * Contact page — thin server wrapper around the localized <ContactContent>.
 */

import type { Metadata } from "next";
import ContactContent from "./contact-content";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Aleppo Power team.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return <ContactContent />;
}
