import { describe, expect, it } from "vitest";

import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { guideSchema, readGuideForm } from "./guideSchema";

const REGION = "00000000-0000-4000-8000-000000000001";

const buildForm = (fields: Record<string, string | string[]> = {}) => {
  const form = new FormData();
  const base: Record<string, string | string[]> = { name: "Pemba Tamang", role: "Trek leader", specialtyIcon: "mountain_flag", firstAid: "wfr", ...fields };
  for (const [name, value] of Object.entries(base)) {
    for (const item of Array.isArray(value) ? value : [value]) form.append(name, item);
  }
  return form;
};

const parse = (fields?: Record<string, string | string[]>) => guideSchema.safeParse(readGuideForm(buildForm(fields)));

const errorsOf = (fields: Record<string, string | string[]>) => {
  const result = parse(fields);
  if (result.success) throw new Error("expected the form to be rejected");
  return toFieldErrors(result.error);
};

describe("guideSchema", () => {
  it("accepts a guide with a name and a role; switches left off are off", () => {
    expect(parse().data).toMatchObject({
      name: "Pemba Tamang",
      age: null,
      yearsGuiding: null,
      languages: [],
      regionIds: [],
      licenceValidUntil: null,
      photoId: null,
      showOnAbout: false,
      canLeadTreks: false,
    });
  });

  it("requires a name and a role", () => {
    expect(errorsOf({ name: " ", role: "" })).toMatchObject({ name: "Enter the guide's full name.", role: "Enter the guide's role, e.g. Trek leader." });
  });

  it("reads numbers, switches, regions and the licence month", () => {
    const result = parse({ age: "38", yearsGuiding: "16", showOnAbout: "on", regionId: [REGION, REGION], licenceValidUntil: "2027-03" });
    expect(result.data).toMatchObject({ age: 38, yearsGuiding: 16, showOnAbout: true, regionIds: [REGION], licenceValidUntil: "2027-03" });
    expect(errorsOf({ age: "12" }).age).toMatch(/between 18 and 90/);
    expect(errorsOf({ licenceValidUntil: "2027-13" }).licenceValidUntil).toBe("Pick the month the licence runs out.");
    expect(errorsOf({ regionId: ["langtang"] })["regionIds.0"]).toBe("Pick the regions from the list.");
  });

  it("keeps each language once, ignoring case, and up to 10", () => {
    expect(parse({ language: ["English", " Nepali ", "english", ""] }).data?.languages).toEqual(["English", "Nepali"]);
    const eleven = Array.from({ length: 11 }, (_, index) => `Language ${index}`);
    expect(errorsOf({ language: eleven }).languages).toBe("Up to 10 languages.");
  });

  it("only takes known icons and first aid levels", () => {
    expect(errorsOf({ specialtyIcon: "rocket" }).specialtyIcon).toBe("Pick an icon.");
    expect(errorsOf({ firstAid: "doctor" }).firstAid).toBe("Pick the first aid training.");
  });
});
