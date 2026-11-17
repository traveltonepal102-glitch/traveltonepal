import type { ConsentRecord } from "@ttn/site-data/consent";
import { getConsent, subscribeToConsent } from "@ttn/site-data/consentStore";
import { useSyncExternalStore } from "react";

/**
 * The visitor's choice: a record once they decided, null when they have not, and undefined before the browser has been
 * read (server render and first paint), so nothing loads early.
 */
export const useConsent = (): ConsentRecord | null | undefined => useSyncExternalStore(subscribeToConsent, getConsent, () => undefined);
