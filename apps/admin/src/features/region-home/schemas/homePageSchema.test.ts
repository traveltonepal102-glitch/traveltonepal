import { describe, expect, it } from "vitest";

import { homePageSchema, readHomePageForm } from "./homePageSchema";

const PHOTO_ID = "4f7c2a6e-3b1d-4c8e-9a2f-1d5e6b7c8a90";
const TREK_ID = "6ed2c075-a84d-4a0f-a1e6-2a97bb60ce39";

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) data.append(name, value);
  return readHomePageForm(data);
};

const FILLED = {
  photoId: PHOTO_ID,
  photoAlt: "Manaslu above Samagaon",
  heading: "Manaslu Circuit Trek: 13 Days Itinerary and Cost",
  intro: "A private trek around the eighth highest mountain.",
  buttonLabel: "Plan my trek on WhatsApp",
};

describe("region Home page", () => {
  it("saves the top, with or without a main trek", () => {
    expect(homePageSchema.safeParse(form(FILLED)).data).toMatchObject({ homeTrekId: null, photoId: PHOTO_ID, heading: FILLED.heading, secondLabel: "", hideFromGoogle: false });
    expect(homePageSchema.safeParse(form({ ...FILLED, homeTrekId: TREK_ID })).data?.homeTrekId).toBe(TREK_ID);
  });

  it("refuses a main trek that isn't a trek id", () => {
    expect(homePageSchema.safeParse(form({ ...FILLED, homeTrekId: "manaslu" })).success).toBe(false);
  });

  it("asks for the top's required fields", () => {
    const result = homePageSchema.safeParse(form({}));
    const errors = Object.fromEntries((result.error?.issues ?? []).map((issue) => [issue.path.join("."), issue.message]));
    expect(Object.keys(errors).sort()).toEqual(["buttonLabel", "heading", "intro", "photoAlt", "photoId"]);
    expect(errors.photoId).toBe("Choose the photo at the top of the page.");
  });
});
