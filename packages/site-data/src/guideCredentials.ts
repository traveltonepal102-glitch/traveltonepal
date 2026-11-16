import type { SiteLanguage } from "@ttn/config/siteLanguage";

import type { WebTrekGuideRow } from "./database.types";

const WORDS = {
  en: {
    wfrBadge: "WFR certified",
    firstAidBadge: "First aid",
    licensedBadge: "Licensed",
    nathmBadge: "NATHM trained",
    localBadge: "Local guide",
    licence: "trekking guide licence",
    wfr: "wilderness first responder",
    firstAid: "first aid",
    noCertificates: "Local trekking guide",
    certificates: {
      nathm: "trekking guide training (NATHM)",
      nma: "mountaineering course (NMA)",
      language: "language certificate",
    } as Record<string, string>,
  },
  de: {
    wfrBadge: "WFR-zertifiziert",
    firstAidBadge: "Erste Hilfe",
    licensedBadge: "Lizenziert",
    nathmBadge: "NATHM-ausgebildet",
    localBadge: "Einheimischer Guide",
    licence: "Trekkingguide-Lizenz",
    wfr: "Wilderness First Responder",
    firstAid: "Erste Hilfe",
    noCertificates: "Einheimischer Trekkingguide",
    certificates: {
      nathm: "Trekkingguide-Ausbildung (NATHM)",
      nma: "Bergsteigerkurs (NMA)",
      language: "Sprachzertifikat",
    } as Record<string, string>,
  },
} satisfies Record<SiteLanguage, unknown>;

/** The tag on a guide's photo: the strongest qualification that is valid today. */
export const certBadgeOf = (row: WebTrekGuideRow, language: SiteLanguage = "en") => {
  const words = WORDS[language];
  if (row.has_wfr) return words.wfrBadge;
  if (row.has_first_aid) return words.firstAidBadge;
  if (row.is_licensed) return words.licensedBadge;
  if (row.other_certificates.includes("nathm")) return words.nathmBadge;
  return words.localBadge;
};

/** A guide's "Cert:" line: what is valid today, in plain words. */
export const certificationsOf = (row: WebTrekGuideRow, language: SiteLanguage = "en") => {
  const words = WORDS[language];
  const names = [
    row.is_licensed && words.licence,
    row.has_wfr && words.wfr,
    row.has_first_aid && words.firstAid,
    ...row.other_certificates.map((certificate) => words.certificates[certificate]),
  ].filter((name): name is string => Boolean(name));
  if (!names.length) return words.noCertificates;
  const text = names.join(", ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};
