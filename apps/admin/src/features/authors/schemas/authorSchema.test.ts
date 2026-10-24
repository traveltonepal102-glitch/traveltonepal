import { describe, expect, it } from "vitest";

import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { authorSchema, readAuthorForm } from "./authorSchema";

const GUIDE = "00000000-0000-4000-8000-000000000011";
const PHOTO = "00000000-0000-4000-8000-000000000012";

const buildForm = (fields: Record<string, string | string[]> = {}) => {
  const form = new FormData();
  const base: Record<string, string | string[]> = { kind: "office", name: "Sujan Sherpa", photoConsent: "on", jobTitle: "Founder", writesIn: "en", ...fields };
  for (const [name, value] of Object.entries(base)) for (const item of [value].flat()) form.append(name, item);
  return form;
};

const parse = (fields?: Record<string, string | string[]>) => authorSchema.safeParse(readAuthorForm(buildForm(fields)));

const errorsOf = (fields: Record<string, string | string[]>) => {
  const result = parse(fields);
  if (result.success) throw new Error("expected the form to be rejected");
  return toFieldErrors(result.error);
};

describe("authorSchema", () => {
  it("accepts an office author with a name, consent, a job title and a language", () => {
    expect(parse().data).toMatchObject({ kind: "office", name: "Sujan Sherpa", photoConsent: true, writesIn: ["en"], topics: [], profileLinks: [], showOnAbout: false });
  });

  it("needs a name, consent, a job title and a language", () => {
    expect(errorsOf({ name: "", photoConsent: "", jobTitle: " ", writesIn: [] })).toMatchObject({
      name: "Enter the author's full name.",
      photoConsent: "Tick this once they have agreed: their name and photo show on every travel guide they write.",
      jobTitle: "Enter the job title shown under the name.",
      writesIn: "Pick the language they write in.",
    });
    expect(errorsOf({ writesIn: ["fr"] })["writesIn.0"]).toBe("Pick English or German.");
  });

  it("needs a guide for a trekking guide author, and drops what comes from Trekking guides", () => {
    expect(errorsOf({ kind: "guide" }).guideId).toBe("Pick the trekking guide.");
    const result = parse({ kind: "guide", guideId: GUIDE, photoId: PHOTO, bio: "Typed before switching.", profileLink: "linkedin.com/in/x", showOnAbout: "on" });
    expect(result.data).toMatchObject({ guideId: GUIDE, name: "", photoId: null, photoConsent: false, bio: "", profileLinks: [], showOnAbout: false });
  });

  it("keeps the guide only for a trekking guide author, and the About page only for the office team", () => {
    expect(parse({ guideId: GUIDE, showOnAbout: "on" }).data).toMatchObject({ guideId: null, showOnAbout: true });
    expect(parse({ kind: "guest", showOnAbout: "on" }).data?.showOnAbout).toBe(false);
  });

  it("tidies profile links and stores the main one first", () => {
    const result = parse({ profileLink: ["traveltonepal.com/about#sujan", "", " https://www.linkedin.com/in/sujan ", "traveltonepal.com/about#sujan"], mainLink: "2" });
    expect(result.data?.profileLinks).toEqual(["https://www.linkedin.com/in/sujan", "https://traveltonepal.com/about#sujan"]);
    expect(errorsOf({ profileLink: ["not a link"] })["profileLinks.0"]).toBe("Paste a full web address, e.g. https://www.linkedin.com/in/…");
    expect(errorsOf({ profileLink: ["mailto:a@b.co"] })["profileLinks.0"]).toMatch(/full web address/);
    expect(errorsOf({ profileLink: Array.from({ length: 6 }, (_, index) => `https://site${index}.com`) }).profileLinks).toBe("Up to 5 links.");
  });

  it("keeps each topic once, ignoring case, up to 10", () => {
    expect(parse({ topic: ["Langtang", "langtang", " Gear & packing ", ""] }).data?.topics).toEqual(["Langtang", "Gear & packing"]);
    expect(errorsOf({ topic: Array.from({ length: 11 }, (_, index) => `Topic ${index}`) }).topics).toBe("Up to 10 topics.");
  });
});
