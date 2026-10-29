import { CONSENT_MAX_AGE_LABEL, CONSENT_STORAGE_KEY } from "@/features/consent/consent";

import { legalTable } from "./legalCompany";

/** "What we use" on Cookie settings ({cookieTable}): only what this website really uses (keep in step with ConsentOptions). */
export const cookieTable = () =>
  legalTable(
    ["Name", "Purpose", "Stored for"],
    [
      [CONSENT_STORAGE_KEY, "Remembers your choices on this page (stored in your browser, not a cookie)", CONSENT_MAX_AGE_LABEL],
      ["Google Analytics", "Counts page visits (only with your consent to analytics)", "Set by Google"],
      ["Microsoft Clarity", "Shows which parts of a page are used (only with your consent to analytics)", "Set by Microsoft"],
      ["Google Maps", "Interactive route, region and office maps (only with your consent or after you click to load a map)", "Set by Google"],
      ["YouTube", "Trail videos in privacy-enhanced mode (only with your consent or after you press Play)", "Set by Google"],
    ],
  );
