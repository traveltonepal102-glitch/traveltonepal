import { describe, expect, it } from "vitest";

import { EMPTY_GUIDE_VALUES } from "../constants";
import { guideSuggestions, toGuideOption } from "./guideOptions";

const LANGTANG = "00000000-0000-4000-8000-000000000001";
const guide = (id: string, regionIds: string[], canLeadTreks = true) =>
  toGuideOption({ ...EMPTY_GUIDE_VALUES, id, name: id, role: "Trek leader", regionIds, canLeadTreks, photo: null, treks: [], updatedAt: "" }, "2026-10-23");

describe("guideSuggestions", () => {
  it("offers the region's guides first, then the others, without picked guides or ones switched off", () => {
    const options = [guide("a", [LANGTANG]), guide("b", []), guide("c", [LANGTANG]), guide("d", [LANGTANG], false)];
    const { inRegion, others } = guideSuggestions(options, ["c"], LANGTANG);
    expect(inRegion.map((option) => option.id)).toEqual(["a"]);
    expect(others.map((option) => option.id)).toEqual(["b"]);
  });

  it("marks a guide licensed only with a valid licence", () => {
    expect(guide("a", []).isLicensed).toBe(false);
    const licensed = toGuideOption({ ...EMPTY_GUIDE_VALUES, id: "x", licenceNumber: "TG-1", photo: null, treks: [], updatedAt: "" }, "2026-10-23");
    expect(licensed.isLicensed).toBe(true);
  });
});
