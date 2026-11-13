import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/shared/JsonLd";
import { SiteFooter } from "@/features/site-footer/SiteFooter";
import { SiteHeader } from "@/features/site-header/SiteHeader";
import { organizationJsonLd } from "@/features/site-settings/organizationJsonLd";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

// This website's own fonts, served from here (no requests to Google) and cut down to Latin letters: Archivo for headings,
// Inter for text, both variable. "optional": a font that is late is simply not swapped in, so text never jumps while the
// page is being read.
const archivo = localFont({ src: "../fonts/Archivo-Variable.woff2", weight: "500 800", variable: "--font-archivo", display: "optional" });
const inter = localFont({ src: "../fonts/Inter-Variable.woff2", weight: "400 700", variable: "--font-inter", display: "optional" });

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: "Private treks in the Annapurna region with a local team.",
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const settings = await getSiteSettings();
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      {/* Browser extensions add attributes to <body> before React loads. */}
      <body suppressHydrationWarning>
        <JsonLd data={organizationJsonLd(settings)} />
        <a href="#main" className="sr-only rounded-[10px] bg-snow px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50">
          Skip to the main content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
};

export default RootLayout;
