import { describe, expect, it } from "vitest";

import { draftFromForm } from "./guideDraft";

const form = (fields: Record<string, string | string[]>) => {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) for (const item of [value].flat()) data.append(name, item);
  return data;
};

describe("draftFromForm", () => {
  it("reads the form as typed so far for the preview", () => {
    const draft = draftFromForm(form({ name: " Pemba ", age: "38", yearsGuiding: "1,4", badge: "solo", certificate: ["wfr", "x"], wfrValidUntil: "2027-03", regionId: ["r1"] }));
    expect(draft).toMatchObject({ name: "Pemba", age: 38, yearsGuiding: 14, badge: "solo", certificates: ["wfr"], wfrValidUntil: "2027-03", regionIds: ["r1"] });
  });

  it("leaves out what isn't valid yet", () => {
    expect(draftFromForm(form({ age: "3.5", yearsGuiding: "lots", badge: "rocket", wfrValidUntil: "2027" }))).toMatchObject({
      age: null,
      yearsGuiding: null,
      badge: "local",
      wfrValidUntil: null,
    });
  });
});
