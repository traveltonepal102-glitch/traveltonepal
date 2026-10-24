import { describe, expect, it } from "vitest";

import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { guideSchema, readGuideForm } from "./guideSchema";

const REGION = "00000000-0000-4000-8000-000000000001";

const buildForm = (fields: Record<string, string | string[]> = {}) => {
  const form = new FormData();
  const base: Record<string, string | string[]> = { name: "Pemba Tamang", role: "Trek leader", badge: "local", ...fields };
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
    const result = parse({ age: "38", yearsGuiding: "16", showOnAbout: "on", photoConsent: "on", regionId: [REGION, REGION], licenceValidUntil: "2027-03" });
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

  it("reads the home village and district, the badge and the certificates", () => {
    const result = parse({ homeVillage: " Briddim ", homeDistrict: "Rasuwa", badge: "culture", certificate: ["nathm", "wfr", "nathm"], wfrValidUntil: "2027-03" });
    expect(result.data).toMatchObject({ homeVillage: "Briddim", homeDistrict: "Rasuwa", badge: "culture", certificates: ["nathm", "wfr"], wfrValidUntil: "2027-03" });
    expect(errorsOf({ badge: "rocket" }).badge).toBe("Pick the badge on the photo.");
    expect(errorsOf({ certificate: ["doctor"] })["certificates.0"]).toBe("Pick the training from the list.");
    expect(errorsOf({ certificate: ["wfr"], wfrValidUntil: "2027-13" }).wfrValidUntil).toBe("Pick the month the WFR certificate runs out.");
  });

  it("keeps an end month only for a ticked certificate", () => {
    expect(parse({ wfrValidUntil: "2027-03", firstAidValidUntil: "2027-04" }).data).toMatchObject({ wfrValidUntil: null, firstAidValidUntil: null });
    expect(parse({ certificate: ["first_aid"], firstAidValidUntil: "2027-04" }).data?.firstAidValidUntil).toBe("2027-04");
  });

  it("needs the guide's consent before they show anywhere on the website", () => {
    const message = "Tick this once the guide has agreed, or switch off every place this guide appears.";
    expect(errorsOf({ showOnAbout: "on" }).photoConsent).toBe(message);
    expect(errorsOf({ canFactCheck: "on" }).photoConsent).toBe(message);
    expect(parse({ showOnAbout: "on", canLeadTreks: "on", photoConsent: "on" }).data).toMatchObject({ photoConsent: true, showOnAbout: true });
    expect(parse().success).toBe(true);
  });
});
