import { splitLegalSections, toLegalTextDoc } from "@ttn/ui/lib/legalText";
import { z } from "zod";

import type { SiteSettings } from "@/features/site-settings/types";
import type { WebSitePageRow } from "@/lib/supabase/database.types";

import { cookieTable } from "./cookieTable";
import { companyRegisters, legalPlaceholderValues, legalTable } from "./legalCompany";
import { LEGAL_MENU } from "./legalDocs";
import { fillLegalPlaceholders } from "./legalPlaceholders";
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

/** "If you cancel" → "if-you-cancel", made unique on the page ("if-you-cancel-2"). */
const sectionIds = (headings: readonly string[]) => {
  const seen = new Map<string, number>();
  return headings.map((heading) => {
    const base = heading.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  });
};

/** A legal page's web_site_pages row as the page shows it, with the company details from Site settings filled in. */
export const toLegalDoc = (slug: LegalSlug, row: WebSitePageRow, settings: SiteSettings): LegalDoc => {
  const content = contentSchema.parse(row.content ?? {});
  const body = fillLegalPlaceholders(toLegalTextDoc(content.body), legalPlaceholderValues(settings), {
    registers: legalTable(["Register", "Number"], companyRegisters(settings)),
    cookieTable: cookieTable(),
  });
  const { lead, sections } = splitLegalSections(body);
  const ids = sectionIds(sections.map((section) => section.heading));
  return {
    slug,
    title: row.heading.trim(),
    intro: row.intro.trim(),
    updated: formatDay(content.lastUpdated),
    ownerNote: content.lawyerChecked ? undefined : LEGAL_MENU.find((item) => item.slug === slug)?.uncheckedNote,
    lead,
    sections: sections.map((section, index) => ({ ...section, id: ids[index] })),
  };
};
