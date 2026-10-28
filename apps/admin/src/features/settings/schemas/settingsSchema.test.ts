import { describe, expect, it } from "vitest";

import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { readSettingsForm, settingsSchema } from "./settingsSchema";

const BASE: Record<string, string | string[]> = {
  phoneCountryCode: "977",
  phoneNumber: "984 319-7197",
  email: "hello@traveltonepal.com",
  officeAddress: "Thamel, Kathmandu, Nepal",
  officeDay: ["5", "0", "1", "0"],
  officeOpens: "09:00",
  officeCloses: "18:00",
  replyLanguage: ["English", "english", "Nepali"],
  membership: ["TAAN"],
  instagramUrl: "www.instagram.com/traveltonepal",
};

const form = (fields: Record<string, string | string[]> = {}) => {
  const data = new FormData();
  for (const [name, value] of Object.entries({ ...BASE, ...fields })) {
    for (const item of Array.isArray(value) ? value : [value]) data.append(name, item);
  }
  return data;
};

const parse = (fields?: Record<string, string | string[]>) => settingsSchema.safeParse(readSettingsForm(form(fields)));
const errorsOf = (fields: Record<string, string | string[]>) => {
  const result = parse(fields);
  if (result.success) throw new Error("expected the form to be rejected");
  return toFieldErrors(result.error);
};

describe("settingsSchema", () => {
  it("tidies the number, the days, the languages and a profile link", () => {
    expect(parse().data).toMatchObject({
      phoneNumber: "9843197197",
      officeDays: [0, 1, 5],
      replyLanguages: ["English", "Nepali"],
      instagramUrl: "https://www.instagram.com/traveltonepal",
      tourismRegistration: "",
      foundedYear: null,
      certificatePhotoId: null,
      panCertificatePhotoId: null,
    });
  });

  it("needs a real phone number, an email, an address and at least one office day", () => {
    const errors = errorsOf({ phoneNumber: "12", email: "not an email", officeAddress: "", officeDay: [] });
    expect(Object.keys(errors).sort()).toEqual(["email", "officeAddress", "officeDays", "phoneNumber"]);
  });

  it("refuses an office that closes before it opens, and a link that isn't a web address", () => {
    expect(errorsOf({ officeCloses: "08:00" }).officeCloses).toBe("The office must close after it opens.");
    expect(errorsOf({ youtubeUrl: "not a link" })).toHaveProperty("youtubeUrl");
  });
});
