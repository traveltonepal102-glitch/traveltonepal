import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Our type scale (theme.css: --text-caption, --text-h3…). tailwind-merge has to know these are font sizes;
 * otherwise it reads "text-caption" as a color and drops a color like "text-ink" next to it.
 */
const FONT_SIZES = ["display-xl", "display", "h1", "h1-sm", "h2", "h2-sm", "h3", "h4", "body-lg", "body", "body-sm", "caption", "label", "eyebrow", "price"];

const twMerge = extendTailwindMerge({ extend: { classGroups: { "font-size": [{ text: FONT_SIZES }] } } });

/** Joins class names and lets later Tailwind classes override earlier ones (shadcn's `cn`). */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
