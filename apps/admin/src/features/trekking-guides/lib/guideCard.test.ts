import { describe, expect, it } from "vitest";

import { EMPTY_GUIDE_VALUES } from "../constants";
import type { TrekkingGuideValues } from "../types";
import { currentCertificates, guideCardView } from "./guideCard";

const TODAY = "2026-10-23";
const card = (overrides: Partial<TrekkingGuideValues>, region?: string) => guideCardView({ ...EMPTY_GUIDE_VALUES, ...overrides }, region, TODAY);

describe("guideCardView", () => {
  it("prints the first region on the local badge, and the other badges as they are", () => {
    expect(card({ badge: "local" }, "Langtang").badge).toEqual({ label: "Langtang local", icon: "mountain_flag" });
    expect(card({ badge: "local" }).badge.label).toBe("Valley local");
    expect(card({ badge: "family" }, "Langtang").badge).toEqual({ label: "Family treks", icon: "family_restroom" });
  });

  it("shows the highest current certificate as the green badge", () => {
    const licensed = { licenceNumber: "TG-1", licenceValidUntil: "2030-01" };
    expect(card({}).certBadge).toBeNull();
    expect(card(licensed).certBadge).toBe("Licensed");
    expect(card({ ...licensed, certificates: ["first_aid"] }).certBadge).toBe("First aid");
    expect(card({ ...licensed, certificates: ["first_aid", "wfr"] }).certBadge).toBe("WFR certified");
    expect(card({ ...licensed, certificates: ["wfr"], wfrValidUntil: "2026-09" }).certBadge).toBe("Licensed");
  });

  it("lists the licence and current certificates in the Cert line, in the form's order", () => {
    const guide = { licenceNumber: "TG-1", certificates: ["language", "wfr", "nathm"] as TrekkingGuideValues["certificates"] };
    expect(card(guide).certLine).toBe("Govt. licence, NATHM trained, WFR, Language cert.");
    expect(card({ ...guide, licenceValidUntil: "2025-01" }).certLine).toBe("NATHM trained, WFR, Language cert.");
    expect(card({}).certLine).toBe("");
  });

  it("writes the age and experience, and the home village and district", () => {
    expect(card({ age: 38, yearsGuiding: 14, homeVillage: "Briddim", homeDistrict: "Rasuwa" })).toMatchObject({ experience: "38 yrs · 14+ yrs exp", home: "Briddim, Rasuwa" });
    expect(card({ yearsGuiding: 0 }).experience).toBe("0+ yrs exp");
    expect(card({}).experience).toBe("");
  });

  it("drops a certificate once its end month has passed", () => {
    const guide = { ...EMPTY_GUIDE_VALUES, certificates: ["wfr", "first_aid", "nma"] as TrekkingGuideValues["certificates"], wfrValidUntil: "2026-10", firstAidValidUntil: "2026-09" };
    expect(currentCertificates(guide, TODAY)).toEqual(["wfr", "nma"]);
  });
});
