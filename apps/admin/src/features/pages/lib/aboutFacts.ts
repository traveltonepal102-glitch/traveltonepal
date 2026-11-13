import type { SiteSettings } from "@/features/settings/types";

import type { AboutFacts } from "../types";

/**
 * What the About page fills in by itself from Site settings and Regions, as the About editor shows it (read-only).
 * The regions are Travel To Nepal's: a region website passes null and types its own number.
 */
export const aboutFactsFrom = (settings: SiteSettings, regionCount: number | null): AboutFacts => ({
  foundedYear: settings.foundedYear,
  regionCount,
  licences: [
    { label: "Department of Tourism", value: settings.tourismRegistration && `Reg. ${settings.tourismRegistration}` },
    { label: "Tourism licence", value: settings.tourismLicence },
    { label: "Tax number (PAN)", value: settings.panNumber },
    { label: "Staff insurance", value: settings.staffInsurer },
    { label: "Memberships", value: settings.memberships.join(", ") },
  ].filter((licence) => licence.value.trim()),
  hasCertificate: settings.certificatePhoto !== null,
  hasPanCertificate: settings.panCertificatePhoto !== null,
});
