import type { WebTrekGuideRow } from "./database.types";

/** The tag on a guide's photo: the strongest qualification that is valid today. */
export const certBadgeOf = (row: WebTrekGuideRow) => {
  if (row.has_wfr) return "WFR certified";
  if (row.has_first_aid) return "First aid";
  if (row.is_licensed) return "Licensed";
  if (row.other_certificates.includes("nathm")) return "NATHM trained";
  return "Local guide";
};

const CERTIFICATE_NAMES: Record<string, string> = {
  nathm: "trekking guide training (NATHM)",
  nma: "mountaineering course (NMA)",
  language: "language certificate",
};

/** A guide's "Cert:" line: what is valid today, in plain words. */
export const certificationsOf = (row: WebTrekGuideRow) => {
  const names = [
    row.is_licensed && "trekking guide licence",
    row.has_wfr && "wilderness first responder",
    row.has_first_aid && "first aid",
    ...row.other_certificates.map((certificate) => CERTIFICATE_NAMES[certificate]),
  ].filter((name): name is string => Boolean(name));
  if (!names.length) return "Local trekking guide";
  const text = names.join(", ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};
