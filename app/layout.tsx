import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { I18nProvider } from "@/components/i18n-context";
import { CartProvider } from "@/components/cart-context";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import CartToast from "@/components/cart-toast";
import FloatingActions from "@/components/floating-actions";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.origin),
  title: {
    default: "Aleppo Power — Solar & Electrical Equipment Store",
    template: "%s | Aleppo Power",
  },
  description:
    "Solar panels, inverters, batteries, cables and electrical equipment at fair prices — with expert support.",
  openGraph: {
    siteName: "Aleppo Power",
    title: "Aleppo Power — Solar & Electrical Equipment Store",
    description:
      "Solar panels, inverters, batteries, cables and electrical equipment at fair prices.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/panel-mono-550.jpg",
        width: 1024,
        height: 1024,
        alt: "Aleppo Power solar panel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aleppo Power — Solar & Electrical Equipment Store",
    description:
      "Solar panels, inverters, batteries, cables and electrical equipment at fair prices.",
    images: ["/images/panel-mono-550.jpg"],
  },
};

/** Mobile browser chrome: amber theme color matching the brand. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f59e0b",
};

/**
 * Root layout: the HTML shell every page is rendered into.
 * I18nProvider (language + RTL) wraps everything; CartProvider shares the
 * cart state between header, pages and forms.
 * suppressHydrationWarning is set because the language provider may flip
 * <html lang/dir> right after mount.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        {/* Apply the saved language/direction BEFORE first paint, so Arabic
            users never see a right-to-left layout flash. The i18n provider
            reads the same localStorage key and agrees with this value. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var l=localStorage.getItem('sunvolt-lang');if(!l){l=(navigator.language||'').toLowerCase().indexOf('ar')===0?'ar':'en';}if(l==='ar'){document.documentElement.lang='ar';document.documentElement.dir='rtl';}}catch(e){}",
          }}
        />
        <I18nProvider>
          <CartProvider>
            <SiteHeader />
            {/* id="main" is the target of the skip link in the header */}
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
            {/* Global overlays: cart toast + floating WhatsApp / back-to-top */}
            <CartToast />
            <FloatingActions />
          </CartProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
