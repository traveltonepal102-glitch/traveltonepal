import { DM_Sans, Outfit } from "next/font/google";

// Variable fonts, self-hosted by next/font at build time (no requests to Google, GDPR).
const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"] });

/** Class names that define --font-outfit and --font-dm-sans, used by theme.css. */
export const fontVariables = `${outfit.variable} ${dmSans.variable}`;
