import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import { SiteFooter } from "@/features/site-footer/components/SiteFooter";

import "./globals.css";

// Variable fonts, self-hosted by next/font at build time (no requests to Google, GDPR).
// One file per font covers every weight we use (Outfit 500–800, DM Sans 400–700).
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Travel To Nepal", template: "%s · Travel To Nepal" },
  description: "Trekking in Nepal with a local team.",
};

// No header here: the home page puts the overlay header on its hero photo, every other page
// renders the solid <SiteHeader /> itself (a shared route-group layout once more pages exist).
const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html lang="en" className={`${outfit.variable} ${dmSans.variable} h-full antialiased`}>
    {/* Browser extensions (e.g. Grammarly) add attributes to <body> before React loads. This only
        ignores attribute differences on <body> itself, not on anything inside it. */}
    <body className="flex min-h-full flex-col" suppressHydrationWarning>
      {children}
      <SiteFooter />
    </body>
  </html>
);

export default RootLayout;
