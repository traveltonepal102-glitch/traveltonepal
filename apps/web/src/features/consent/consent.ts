/**
 * The visitor's cookie choices, kept in their own browser (localStorage) and nowhere else.
 * Only optional things the site really loads have a choice: today that is Google Maps. Add a
 * category here (and on the Cookie settings page) before adding analytics or video embeds.
 */
export type ConsentChoices = {
  /** Google Maps (sends the visitor's IP address to Google). */
  externalMedia: boolean;
};

export type ConsentRecord = ConsentChoices & {
  version: typeof CONSENT_VERSION;
  /** ISO date and time of the decision. */
  decidedAt: string;
};

/** Bump when the categories change, so everyone is asked again. */
export const CONSENT_VERSION = 1;

export const CONSENT_STORAGE_KEY = "ttn-consent";

/** Ask again after a year (a common expectation of EU data protection authorities). */
export const CONSENT_MAX_AGE_DAYS = 365;
/** CONSENT_MAX_AGE_DAYS as the privacy and cookie pages say it. */
export const CONSENT_MAX_AGE_LABEL = "12 months";

export const ALL_ALLOWED: ConsentChoices = { externalMedia: true };
export const ONLY_NECESSARY: ConsentChoices = { externalMedia: false };

const DAY_MS = 24 * 60 * 60 * 1000;

/** The stored choice, or null when there is none, it is unreadable, from an older version or too old. */
export const parseConsent = (raw: string | null, now: Date): ConsentRecord | null => {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== "object" || value === null) return null;
    const { version, decidedAt, externalMedia } = value as Record<string, unknown>;
    if (version !== CONSENT_VERSION || typeof externalMedia !== "boolean" || typeof decidedAt !== "string") return null;
    const decided = new Date(decidedAt).getTime();
    if (Number.isNaN(decided) || now.getTime() - decided > CONSENT_MAX_AGE_DAYS * DAY_MS) return null;
    return { version, decidedAt, externalMedia };
  } catch {
    // Not JSON (edited by hand or another site's value): treat as no decision, so the banner asks again.
    return null;
  }
};

export const serializeConsent = (choices: ConsentChoices, now: Date): string =>
  JSON.stringify({ version: CONSENT_VERSION, decidedAt: now.toISOString(), externalMedia: choices.externalMedia } satisfies ConsentRecord);
