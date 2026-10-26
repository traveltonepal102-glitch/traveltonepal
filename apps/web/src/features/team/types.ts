import type { IconName } from "@ttn/ui/icon";

import type { SiteImageSource } from "@/lib/images";

/** A trekking guide on the team. One guide can lead several treks. */
export type TrekGuide = {
  id: string;
  name: string;
  role: string;
  /** Home village and district, e.g. "Briddim, Rasuwa". */
  home: string;
  /** Age and guiding experience, e.g. "38 yrs · 16+ yrs exp". */
  experience: string;
  /** What the guide is known for, shown on the photo, e.g. "Langtang local". */
  specialty: { label: string; icon: IconName };
  /** Short certification badge on the photo, e.g. "WFR certified". */
  certBadge: string;
  /** A line in the guide's own words. */
  quote: string;
  certifications: string;
  languages: readonly string[];
  photo?: SiteImageSource;
};
