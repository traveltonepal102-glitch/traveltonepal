import type { HomeTopContent } from "../types";

/** The WhatsApp button's words until the admin writes their own. */
export const DEFAULT_HOME_BUTTON = "Plan my trek on WhatsApp";

const textOf = (value: unknown) => (typeof value === "string" ? value : "");

/** A region Home's saved `content`, read leniently (a missing value is blank; the button has its default). */
export const toHomeTopContent = (content: unknown): HomeTopContent => {
  const saved = content && typeof content === "object" ? (content as Record<string, unknown>) : {};
  return { photoAlt: textOf(saved.photoAlt), buttonLabel: textOf(saved.buttonLabel) || DEFAULT_HOME_BUTTON, secondLabel: textOf(saved.secondLabel) };
};
