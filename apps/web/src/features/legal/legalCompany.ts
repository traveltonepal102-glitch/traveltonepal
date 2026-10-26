import type { SiteSettings } from "@/features/site-settings/types";

/** "[COMPANY LEGAL NAME]" until the legal name is typed in Site settings (shown so the gap is noticed, never invented). */
const MISSING_NAME = "[COMPANY LEGAL NAME]";

/** "Travel To Nepal Pvt. Ltd." from the legal name and form in Site settings. */
export const companyLegalName = ({ company }: SiteSettings) =>
  company.legalName ? [company.legalName, company.legalForm].filter(Boolean).join(" ") : MISSING_NAME;

/** The registers the company is entered in, with their numbers: only the ones typed in Site settings. */
export const companyRegisters = ({ company }: SiteSettings): [string, string][] =>
  (
    [
      ["Office of the Company Registrar, Nepal", company.companyRegistration],
      ["Department of Tourism, trekking agency registration", company.tourismRegistration],
      ["Department of Tourism, tourism licence", company.tourismLicence],
      ["Tax number (PAN / VAT)", company.panNumber],
      ["TAAN membership", company.taanNumber],
    ] as [string, string][]
  ).filter(([, number]) => number);
