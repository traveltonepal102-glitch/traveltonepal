export { legalTable } from "@ttn/site-data/legalText";

import type { SiteSettings } from "@/features/site-settings/types";

/** A blank detail shows as a visible gap ("[COMPANY LEGAL NAME]"), so it is noticed and never invented. */
const orGap = (value: string, gap: string) => value.trim() || `[${gap}]`;

/** "Travel To Nepal Pvt. Ltd." from the legal name and form in Site settings. */
export const companyLegalName = ({ company }: SiteSettings) =>
  company.legalName ? [company.legalName, company.legalForm].filter(Boolean).join(" ") : "[COMPANY LEGAL NAME]";

/** What the legal texts' placeholders stand for: {company}, {address}, {email}, {phone}, {registration}… */
export const legalPlaceholderValues = (settings: SiteSettings): Record<string, string> => ({
  company: companyLegalName(settings),
  address: orGap(settings.contact.officeAddress, "OFFICE ADDRESS"),
  email: orGap(settings.contact.email, "EMAIL"),
  phone: orGap(settings.contact.phoneDisplay, "PHONE"),
  registration: orGap(settings.company.tourismRegistration, "REGISTRATION NUMBER"),
  licence: orGap(settings.company.tourismLicence, "LICENCE NUMBER"),
  pan: orGap(settings.company.panNumber, "PAN NUMBER"),
});

/** The registers the company is entered in, with their numbers: only the ones typed in Site settings. */
export const companyRegisters = ({ company }: SiteSettings): [string, string][] =>
  (
    [
      ["Department of Tourism, trekking agency registration", company.tourismRegistration],
      ["Department of Tourism, tourism licence", company.tourismLicence],
      ["Tax number (PAN / VAT)", company.panNumber],
    ] as [string, string][]
  ).filter(([, number]) => number);
