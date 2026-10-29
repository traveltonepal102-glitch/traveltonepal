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

  it("keeps the map's address from Google's embed code, and accepts a share link", () => {
    const src = "https://www.google.com/maps/embed?pb=!1m18!1m12!3d27.70!2sTravel%20To%20Nepal!5e0&amp;hl=en";
    const iframe = `<iframe src="${src}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
    expect(parse({ googleMapsUrl: "maps.app.goo.gl/HR1FQfBGSSpwiyHq5", googleMapsEmbedUrl: iframe }).data).toMatchObject({
      googleMapsUrl: "https://maps.app.goo.gl/HR1FQfBGSSpwiyHq5",
      googleMapsEmbedUrl: src.replace("&amp;", "&"),
    });
    expect(parse({ googleMapsEmbedUrl: src.replace("&amp;", "&") }).data?.googleMapsEmbedUrl).toBe(src.replace("&amp;", "&"));
    expect(parse().data).toMatchObject({ googleMapsUrl: "", googleMapsEmbedUrl: "" });
  });

  it("refuses a map link that isn't Google Maps, and a share link pasted as the embed code", () => {
    expect(errorsOf({ googleMapsUrl: "https://example.com/maps" })).toHaveProperty("googleMapsUrl");
    expect(errorsOf({ googleMapsEmbedUrl: "https://maps.app.goo.gl/HR1FQfBGSSpwiyHq5" })).toHaveProperty("googleMapsEmbedUrl");
    expect(errorsOf({ googleMapsEmbedUrl: '<iframe src="https://evil.example/maps/embed?pb=1"></iframe>' })).toHaveProperty("googleMapsEmbedUrl");
  });
});
