import type { IconName } from "@ttn/ui/icon";

import { GUIDE_BADGES, GUIDE_CERTIFICATES, LICENCE_LABEL } from "../constants";
import type { GuideCertificate, TrekkingGuideValues } from "../types";
import { homeLine, isValidThrough, licenceStatus } from "./guideRules";

type CardInput = Pick<
  TrekkingGuideValues,
  "badge" | "age" | "yearsGuiding" | "homeVillage" | "homeDistrict" | "licenceNumber" | "licenceValidUntil" | "certificates" | "wfrValidUntil" | "firstAidValidUntil"
>;

/** What the guide card on a trek page prints besides the typed words (design: "How the card looks on the trek page"). */
export type GuideCardView = {
  /** On the photo, top left, e.g. "Langtang local". */
  badge: { label: string; icon: IconName };
  /** The green badge on the photo, top right: the highest current one, or null. */
  certBadge: string | null;
  /** "Govt. licence, NATHM trained, WFR", or "" with nothing current. */
  certLine: string;
  /** "38 yrs · 14+ yrs exp" */
  experience: string;
  /** "Briddim, Rasuwa" */
  home: string;
};

const END_MONTH: Partial<Record<GuideCertificate, "wfrValidUntil" | "firstAidValidUntil">> = { wfr: "wfrValidUntil", first_aid: "firstAidValidUntil" };

/** The ticked certificates still valid on `today` ("YYYY-MM-DD" in Nepal): an expired one no longer shows. */
export const currentCertificates = (guide: CardInput, today: string) =>
  guide.certificates.filter((certificate) => {
    const field = END_MONTH[certificate];
    return !field || isValidThrough(guide[field], today);
  });

/**
 * The card's badges and lines. "Local to the region" prints the first region the guide leads ("Langtang local").
 * The green badge is the highest of WFR, first aid and a valid licence.
 */
export const guideCardView = (guide: CardInput, firstRegionName: string | undefined, today: string): GuideCardView => {
  const badge = GUIDE_BADGES.find((option) => option.value === guide.badge) ?? GUIDE_BADGES[0];
  const current = currentCertificates(guide, today);
  const isLicensed = licenceStatus(guide, today) === "valid";
  const certBadge = current.includes("wfr") ? "WFR certified" : current.includes("first_aid") ? "First aid" : isLicensed ? "Licensed" : null;
  const shortNames = GUIDE_CERTIFICATES.filter((option) => current.includes(option.value)).map((option) => option.short);

  return {
    badge: { label: badge.value === "local" ? `${firstRegionName ?? "Valley"} local` : badge.label, icon: badge.icon },
    certBadge,
    certLine: [...(isLicensed ? [LICENCE_LABEL.short] : []), ...shortNames].join(", "),
    experience: [guide.age !== null && `${guide.age} yrs`, guide.yearsGuiding !== null && `${guide.yearsGuiding}+ yrs exp`].filter(Boolean).join(" · "),
    home: homeLine(guide),
  };
};
