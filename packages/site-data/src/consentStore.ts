import { CONSENT_STORAGE_KEY, parseConsent, serializeConsent } from "./consent";
import type { ConsentChoices, ConsentRecord } from "./consent";

const CHANGE_EVENT = "ttn-consent-change";

/** Raw stored text; storage can throw (blocked cookies, private mode), which counts as "no decision". */
const readRaw = (): string | null => {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return null;
  }
};

// useSyncExternalStore needs the same object back while nothing changed.
let cached: { raw: string | null; record: ConsentRecord | null } | undefined;
// When storage is blocked, the choice still holds until the visitor leaves the page.
let unsaved: ConsentRecord | null = null;

/** The visitor's current choice, or null when they have not decided. Browser only. */
export const getConsent = (): ConsentRecord | null => {
  const raw = readRaw();
  if (raw === null && unsaved) return unsaved;
  if (!cached || cached.raw !== raw) cached = { raw, record: parseConsent(raw, new Date()) };
  return cached.record;
};

/**
 * Saves the choice and tells every part of the page (banner, maps, settings) right away. Returns false
 * when the browser blocks storage: the choice then only lasts until the visitor leaves the page.
 */
export const saveConsent = (choices: ConsentChoices): boolean => {
  const serialized = serializeConsent(choices, new Date());
  let isStored = true;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, serialized);
  } catch {
    isStored = false;
    unsaved = parseConsent(serialized, new Date());
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return isStored;
};

/** Calls back on a choice made on this page or in another tab. */
export const subscribeToConsent = (onChange: () => void) => {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};
