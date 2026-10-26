import { CONSENT_MAX_AGE_LABEL, CONSENT_STORAGE_KEY } from "@/features/consent/consent";

import type { LegalDoc } from "../types";

/** Cookie settings page text: only what this website really uses (keep in step with ConsentOptions). */
export const COOKIES: LegalDoc = {
  slug: "cookies",
  title: "Cookie settings",
  updated: "[DATE]",
  intro: "Choose what this website may load. Necessary functions are always on; everything else stays off until you allow it.",
  sections: [
    {
      id: "what-we-use",
      heading: "What we use",
      table: {
        head: ["Name", "Purpose", "Stored for"],
        rows: [
          [CONSENT_STORAGE_KEY, "Remembers your choices on this page (stored in your browser, not a cookie)", CONSENT_MAX_AGE_LABEL],
          ["Google Maps", "Interactive route and region maps (only with your consent or after you click to load a map)", "Set by Google"],
        ],
      },
    },
    {
      id: "changing-your-mind",
      heading: "Changing your mind",
      paragraphs: [
        'You can come back to this page at any time from the "Cookie settings" link at the bottom of every page. Withdrawing consent does not affect anything loaded before.',
      ],
    },
  ],
};
