import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Joins class names and lets later Tailwind classes override earlier ones (shadcn's `cn`). */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
