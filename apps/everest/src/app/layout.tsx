import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/shared/JsonLd";
import { AnalyticsScripts } from "@/features/analytics/AnalyticsScripts";
import { CookieBanner } from "@/features/consent/components/CookieBanner";
import { SiteFooter } from "@/features/site-footer/SiteFooter";
import { SiteHeader } from "@/features/site-header/SiteHeader";
import { organizationJsonLd } from "@/features/site-settings/organizationJsonLd";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { SITE_LANGUAGE, SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

// This website's own fonts (Brand Guidelines 1.0: Outfit for headings, DM Sans for text), served from here (no requests
// to Google), cut down to Latin letters, both variable. "optional": a font that is late is simply not swapped in, so
// text never jumps while the page is being read.
const outfit = localFont({ src: "../fonts/Outfit-Variable.woff2", weight: "600 800", variable: "--font-outfit", display: "optional" });
const dmSans = localFont({ src: "../fonts/DMSans-Variable.woff2", weight: "400 700", variable: "--font-dm-sans", display: "optional" });

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: "Private Treks in der Everest-Region mit einem einheimischen, lizenzierten Team.",
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const settings = await getSiteSettings();
  return (
    <html lang={SITE_LANGUAGE} className={`${outfit.variable} ${dmSans.variable}`}>
      {/* Browser extensions add attributes to <body> before React loads. */}
      <body suppressHydrationWarning>
        <JsonLd data={organizationJsonLd(settings)} />
        <a href="#main" className="sr-only rounded-[10px] bg-snow px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50">
          Zum Hauptinhalt springen
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        {/* Asks on the first visit: Google Tag Manager loads only after "Analyse" is allowed. */}
        <CookieBanner />
        <AnalyticsScripts />
      </body>
    </html>
  );
};

export default RootLayout;
