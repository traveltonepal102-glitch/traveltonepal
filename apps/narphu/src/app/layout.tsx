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

// This website's own font (the brand guide's Mukta), served from here (no requests to Google) and cut down to Latin letters.
// Two files in all (regular and semibold, headings too): every preloaded font competes with the first photo on a phone.
// "optional": a font that is late is simply not swapped in, so text never jumps while the page is being read.
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
  description: "Private Nar Phu Valley treks over Kang La Pass with a licensed local team.",
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const settings = await getSiteSettings();
  return (
    <html lang="en" className={mukta.variable}>
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
