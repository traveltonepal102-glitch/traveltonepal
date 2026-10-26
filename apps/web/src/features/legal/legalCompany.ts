import type { LegalTable } from "@ttn/ui/lib/legalText";

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
  companyRegistration: orGap(settings.company.companyRegistration, "COMPANY REGISTRATION NUMBER"),
  pan: orGap(settings.company.panNumber, "PAN NUMBER"),
  taan: orGap(settings.company.taanNumber, "TAAN NUMBER"),
});

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

const cell = (type: "tableHeader" | "tableCell", text: string) => ({ type, content: [{ type: "paragraph" as const, content: text ? [{ type: "text" as const, text }] : [] }] });

/** A table in the legal text format, from a heading row and rows of plain text. */
export const legalTable = (head: readonly string[], rows: readonly (readonly string[])[]): LegalTable => ({
  type: "table",
  content: [
    { type: "tableRow", content: head.map((text) => cell("tableHeader", text)) },
    ...rows.map((row) => ({ type: "tableRow" as const, content: row.map((text) => cell("tableCell", text)) })),
  ],
});
