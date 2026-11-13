import { CONSENT_MAX_AGE_LABEL, CONSENT_STORAGE_KEY } from "@ttn/site-data/consent";
import type { WebSitePageRow } from "@ttn/site-data/database.types";
import { fillLegalPlaceholders, legalTable, sectionIds } from "@ttn/site-data/legalText";
import { toPageDates } from "@ttn/site-data/pageDates";
import { splitLegalSections, toLegalTextDoc } from "@ttn/ui/lib/legalText";
import { z } from "zod";

import type { SiteSettings } from "@/features/site-settings/types";

import { legalPage } from "./legalPages";
import type { LegalDoc, LegalSlug } from "./types";

const contentSchema = z
  .object({
    body: z.unknown().optional(),
    lawyerChecked: z.boolean().catch(false),
    lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).catch(""),
  })
  .catch({ body: undefined, lawyerChecked: false, lastUpdated: "" });

/** "2026-10-26" → "26 October 2026" (a calendar day: no time zone to shift it). */
const formatDay = (day: string) =>
  day ? new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`)) : "";

/** A blank detail shows as a visible gap ("[OFFICE ADDRESS]"), so it is noticed and never invented. */
const orGap = (value: string, gap: string) => value.trim() || `[${gap}]`;

/** What the legal texts' placeholders stand for: {company}, {address}, {email}, {phone}, {registration}… */
const placeholderValues = (settings: SiteSettings): Record<string, string> => ({
  company: settings.legalName ? [settings.legalName, settings.legalForm].filter(Boolean).join(" ") : "[COMPANY LEGAL NAME]",
  address: orGap(settings.officeAddress, "OFFICE ADDRESS"),
  email: orGap(settings.email, "EMAIL"),
  phone: orGap(settings.phoneDisplay, "PHONE"),
  registration: orGap(settings.tourismRegistration, "REGISTRATION NUMBER"),
  licence: orGap(settings.licence, "LICENCE NUMBER"),
  pan: orGap(settings.panNumber, "PAN NUMBER"),
});

/** The registers the company is entered in: only the ones typed in Site settings. */
const companyRegisters = ({ tourismRegistration, licence, panNumber }: SiteSettings) =>
  [
    ["Department of Tourism, trekking agency registration", tourismRegistration],
    ["Department of Tourism, tourism licence", licence],
    ["Tax number (PAN / VAT)", panNumber],
  ].filter(([, number]) => number);

/** "What we use" on Cookie settings ({cookieTable}): only what this website really uses (keep in step with CookieSettingsPanel). */
const cookieTable = () =>
  legalTable(
    ["Name", "Purpose", "Stored for"],
    [
      [CONSENT_STORAGE_KEY, "Remembers your choice on this page (stored in your browser, not a cookie)", CONSENT_MAX_AGE_LABEL],
      ["Google Maps", "The route maps on trek pages and in blogs (they load with the page); the office map on the Contact page only with your consent or after you click to load it", "Set by Google"],
      ["Embedded videos, maps and widgets", "YouTube, Vimeo, Komoot, Wikiloc and other services embedded in a blog, only with your consent or after you click to load them", "Set by each service"],
    ],
  );

/** A legal page's web_site_pages row as the page shows it, with the company details from Site settings filled in. */
export const toLegalDoc = (slug: LegalSlug, row: WebSitePageRow, settings: SiteSettings): LegalDoc => {
  const content = contentSchema.parse(row.content ?? {});
  const body = fillLegalPlaceholders(toLegalTextDoc(content.body), placeholderValues(settings), {
    registers: legalTable(["Register", "Number"], companyRegisters(settings)),
    cookieTable: cookieTable(),
  });
  const { lead, sections } = splitLegalSections(body);
  const ids = sectionIds(sections.map((section) => section.heading));
  const title = row.heading.trim();
  const intro = row.intro.trim();
  return {
    slug,
    title,
    intro,
    seo: { title: row.seo_title.trim() || title, description: row.seo_description.trim() || intro },
    updated: formatDay(content.lastUpdated),
    dates: toPageDates(row.published_at, content.lastUpdated || row.updated_at),
    ownerNote: content.lawyerChecked ? undefined : legalPage(slug).uncheckedNote,
    lead,
    sections: sections.map((section, index) => ({ ...section, id: ids[index] })),
  };
};
