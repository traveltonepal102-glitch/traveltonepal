import type { SiteSettings } from "@/features/settings/types";

import type { AboutFacts } from "../types";

/** What the About page fills in by itself from Site settings and Regions, as the About editor shows it (read-only). */
export const aboutFactsFrom = (settings: SiteSettings, regionCount: number): AboutFacts => ({
  foundedYear: settings.foundedYear,
  regionCount,
  licences: [
    { label: "Department of Tourism", value: settings.tourismRegistration && `Reg. ${settings.tourismRegistration}` },
    { label: "Tourism licence", value: settings.tourismLicence },
    { label: "Company registration", value: settings.companyRegistration },
    { label: "TAAN member", value: settings.taanNumber && `No. ${settings.taanNumber}` },
    { label: "Tax number (PAN)", value: settings.panNumber },
    { label: "Staff insurance", value: settings.staffInsurer },
    { label: "Other memberships", value: settings.memberships.filter((name) => name.toUpperCase() !== "TAAN").join(", ") },
  ].filter((licence) => licence.value.trim()),
  hasCertificate: settings.certificatePhoto !== null,
});
