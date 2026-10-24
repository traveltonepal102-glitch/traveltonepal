import { GUIDE_BADGE_VALUES, GUIDE_CERTIFICATE_VALUES } from "../constants";
import { readGuideForm } from "../schemas/guideSchema";
import type { GuideBadge, GuideCertificate, TrekkingGuideValues } from "../types";

/** What the card preview needs from the form while it is being typed (languages and photo come from their fields). */
export type GuideDraft = Pick<
  TrekkingGuideValues,
  | "name"
  | "role"
  | "quote"
  | "badge"
  | "age"
  | "yearsGuiding"
  | "homeVillage"
  | "homeDistrict"
  | "regionIds"
  | "licenceNumber"
  | "licenceValidUntil"
  | "certificates"
  | "wfrValidUntil"
  | "firstAidValidUntil"
>;

const numberOrNull = (value: string) => {
  const number = Number(value.replace(/,/g, ""));
  return value.trim() && Number.isInteger(number) ? number : null;
};

const monthOrNull = (value: string) => (/^\d{4}-\d{2}$/.test(value) ? value : null);

const isBadge = (value: string): value is GuideBadge => (GUIDE_BADGE_VALUES as readonly string[]).includes(value);
const isCertificate = (value: string): value is GuideCertificate => (GUIDE_CERTIFICATE_VALUES as readonly string[]).includes(value);

/**
 * The form as typed so far, read leniently for the preview: a value that isn't valid yet is left out (the
 * schema reports it on Save). Never used to save.
 */
export const draftFromForm = (formData: FormData): GuideDraft => {
  const raw = readGuideForm(formData);
  return {
    name: raw.name.trim(),
    role: raw.role.trim(),
    quote: raw.quote.trim(),
    badge: isBadge(raw.badge) ? raw.badge : "local",
    age: numberOrNull(raw.age),
    yearsGuiding: numberOrNull(raw.yearsGuiding),
    homeVillage: raw.homeVillage.trim(),
    homeDistrict: raw.homeDistrict.trim(),
    regionIds: raw.regionIds,
    licenceNumber: raw.licenceNumber.trim(),
    licenceValidUntil: monthOrNull(raw.licenceValidUntil),
    certificates: raw.certificates.filter(isCertificate),
    wfrValidUntil: monthOrNull(raw.wfrValidUntil),
    firstAidValidUntil: monthOrNull(raw.firstAidValidUntil),
  };
};
