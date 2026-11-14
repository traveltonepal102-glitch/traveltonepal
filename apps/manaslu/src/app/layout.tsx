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
import { SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

// This website's own fonts, served from here (no requests to Google) and cut down to Latin letters: Mukta's Devanagari alone was 400 KB.
// Three files in all (Fraunces variable, Mukta regular and semibold): every preloaded font competes with the first photo on a phone.
// "optional": a font that is late is simply not swapped in, so text never jumps while the page is being read (it was 0.3 of layout shift).
const fraunces = localFont({ src: "../fonts/FrauncesSoft-Variable.woff2", weight: "100 900", variable: "--font-fraunces", display: "optional" });
const mukta = localFont({
  src: [
    { path: "../fonts/Mukta-Regular.woff2", weight: "400" },
    { path: "../fonts/Mukta-SemiBold.woff2", weight: "600" },
  ],
  variable: "--font-mukta",
  display: "optional",
});

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: "Private treks in the Manaslu region with a local team.",
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const settings = await getSiteSettings();
  return (
    <html lang="en" className={`${fraunces.variable} ${mukta.variable}`}>
      {/* Browser extensions add attributes to <body> before React loads. */}
      <body suppressHydrationWarning>
        <JsonLd data={organizationJsonLd(settings)} />
        <a href="#main" className="sr-only rounded-[10px] bg-snow px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50">
          Skip to the main content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        {/* Asks on the first visit: Google Tag Manager loads only after "Analytics" is allowed. */}
        <CookieBanner />
        <AnalyticsScripts />
      </body>
    </html>
  );
};

export default RootLayout;
