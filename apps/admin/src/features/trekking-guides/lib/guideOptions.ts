import type { Photo } from "@/features/photos/types";

import type { TrekkingGuide } from "../types";
import { licenceStatus, roleLine } from "./guideRules";

/** A guide as other editors pick them (the trek editor's "Guides"). */
export type GuideOption = {
  id: string;
  name: string;
  /** "Senior trek leader · 14 yrs" */
  roleLine: string;
  languages: string[];
  regionIds: string[];
  photo: Photo | null;
  isLicensed: boolean;
  /** Switched off in Trekking guides: kept on treks that have them, not offered for new picks. */
  canLeadTreks: boolean;
};

export const toGuideOption = (guide: TrekkingGuide, today: string): GuideOption => ({
  id: guide.id,
  name: guide.name,
  roleLine: roleLine(guide),
  languages: guide.languages,
  regionIds: guide.regionIds,
  photo: guide.photo,
  isLicensed: licenceStatus(guide, today) === "valid",
  canLeadTreks: guide.canLeadTreks,
});

/** The guides to offer for a trek in `regionId`: those who lead treks there first, then the others. */
export const guideSuggestions = (options: GuideOption[], pickedIds: string[], regionId: string) => {
  const available = options.filter((option) => option.canLeadTreks && !pickedIds.includes(option.id));
  return {
    inRegion: available.filter((option) => option.regionIds.includes(regionId)),
    others: available.filter((option) => !option.regionIds.includes(regionId)),
  };
};
