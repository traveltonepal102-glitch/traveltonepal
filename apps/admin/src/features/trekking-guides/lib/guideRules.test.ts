import { describe, expect, it } from "vitest";

import { EMPTY_GUIDE_VALUES } from "../constants";
import type { TrekkingGuide } from "../types";
import { filterGuides, licenceStatus, roleLine, spokenLanguages } from "./guideRules";

const TODAY = "2026-10-23";
const LANGTANG = "00000000-0000-4000-8000-000000000001";

const guide = (overrides: Partial<TrekkingGuide>): TrekkingGuide => ({ ...EMPTY_GUIDE_VALUES, id: "g", photo: null, treks: [], updatedAt: "", ...overrides });

const GUIDES = [
  guide({ id: "a", name: "Pemba Tamang", role: "Senior trek leader", home: "Briddim, Rasuwa", regionIds: [LANGTANG], languages: ["English", "Tamang"] }),
  guide({ id: "b", name: "Mingma Sherpa", role: "Trek leader", home: "Khumjung", languages: ["English", "German"] }),
];

const ids = (guides: TrekkingGuide[]) => guides.map((item) => item.id);

describe("licenceStatus", () => {
  it("needs a number, and counts the end month as valid to its last day", () => {
    expect(licenceStatus({ licenceNumber: "", licenceValidUntil: "2030-01" }, TODAY)).toBe("none");
    expect(licenceStatus({ licenceNumber: "TG-1", licenceValidUntil: null }, TODAY)).toBe("valid");
    expect(licenceStatus({ licenceNumber: "TG-1", licenceValidUntil: "2026-10" }, TODAY)).toBe("valid");
    expect(licenceStatus({ licenceNumber: "TG-1", licenceValidUntil: "2026-09" }, TODAY)).toBe("expired");
  });
});

describe("guide list", () => {
  it("searches name, role and home, and filters by region and language", () => {
    expect(ids(filterGuides(GUIDES, { query: "rasuwa", regionId: "", language: "" }))).toEqual(["a"]);
    expect(ids(filterGuides(GUIDES, { query: "", regionId: LANGTANG, language: "" }))).toEqual(["a"]);
    expect(ids(filterGuides(GUIDES, { query: "", regionId: "", language: "German" }))).toEqual(["b"]);
    expect(ids(filterGuides(GUIDES, { query: "leader", regionId: "", language: "English" }))).toEqual(["a", "b"]);
  });

  it("lists the languages spoken A–Z and writes the role line", () => {
    expect(spokenLanguages(GUIDES)).toEqual(["English", "German", "Tamang"]);
    expect(roleLine({ role: "Trek leader", yearsGuiding: 14 })).toBe("Trek leader · 14 yrs");
    expect(roleLine({ role: "Trek leader", yearsGuiding: null })).toBe("Trek leader");
  });
});
