import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import "./globals.css";

// Variable fonts, self-hosted by next/font at build time (no requests to Google, GDPR).
// One file per font covers every weight we use (Outfit 500–800, DM Sans 400–700).
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel To Nepal",
  description: "Trekking in Nepal with a local team.",
};

const RootLayout = ({ children }: LayoutProps<"/">) => (
  <html lang="en" className={`${outfit.variable} ${dmSans.variable} h-full antialiased`}>
    <body className="flex min-h-full flex-col">{children}</body>
  </html>
);

export default RootLayout;
