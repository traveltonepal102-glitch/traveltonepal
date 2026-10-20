import { useSyncExternalStore } from "react";

import type { ConsentRecord } from "./consent";
import { getConsent, subscribeToConsent } from "./consentStore";

/**
 * The visitor's cookie choice: a record once they decided, null when they have not, and undefined
 * before the browser has been read (server render and first paint), so nothing flashes or loads early.
 */
export const useConsent = (): ConsentRecord | null | undefined =>
  useSyncExternalStore(subscribeToConsent, getConsent, () => undefined);
