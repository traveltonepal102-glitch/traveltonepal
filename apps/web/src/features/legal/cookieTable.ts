import { CONSENT_MAX_AGE_LABEL, CONSENT_STORAGE_KEY } from "@/features/consent/consent";

import { legalTable } from "./legalCompany";

/** "What we use" on Cookie settings ({cookieTable}): only what this website really uses (keep in step with ConsentOptions). */
export const cookieTable = () =>
  legalTable(
    ["Name", "Purpose", "Stored for"],
    [
      [CONSENT_STORAGE_KEY, "Remembers your choices on this page (stored in your browser, not a cookie)", CONSENT_MAX_AGE_LABEL],
      ["Google Maps", "Interactive route and region maps (only with your consent or after you click to load a map)", "Set by Google"],
    ],
  );
