import type { SiteLanguage } from "@ttn/config/siteLanguage";

import type { HomeTopContent } from "../types";

/** The WhatsApp button's words, in the website's language, until the admin writes their own (the websites fall back to the same words). */
export const DEFAULT_HOME_BUTTON: Record<SiteLanguage, string> = {
  en: "Plan my trek on WhatsApp",
  de: "Trek per WhatsApp planen",
};

const textOf = (value: unknown) => (typeof value === "string" ? value : "");

/** A region Home's saved `content`, read leniently (a missing value is blank; the button has its default in the website's language). */
export const toHomeTopContent = (content: unknown, language: SiteLanguage): HomeTopContent => {
  const saved = content && typeof content === "object" ? (content as Record<string, unknown>) : {};
  return { photoAlt: textOf(saved.photoAlt), buttonLabel: textOf(saved.buttonLabel) || DEFAULT_HOME_BUTTON[language], secondLabel: textOf(saved.secondLabel) };
};
