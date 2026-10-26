import { describe, expect, it } from "vitest";

import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { aboutPageSchema, readAboutForm } from "./aboutPageSchema";
import { contactPageSchema, readContactForm } from "./contactPageSchema";
import { listPagesSchema, readListPagesForm } from "./listPagesSchema";

const ID = "6f1c2b3a-1d2e-4f50-8a9b-0c1d2e3f4a5b";
const rich = (text: string) => JSON.stringify({ type: "doc", content: [{ type: "paragraph", content: text ? [{ type: "text", text }] : [] }] });

const form = (fields: [string, string][]) => {
  const data = new FormData();
  for (const [name, value] of fields) data.append(name, value);
  return data;
};

const top: [string, string][] = [
  ["eyebrow", "About Travel To Nepal"],
  ["heading", " A Nepali team "],
  ["intro", "We are licensed."],
  ["seoTitle", "About us"],
  ["seoDescription", "Meet the team."],
  ["seoKeyword", "Nepali trekking company"],
  ["photoId", ""],
];

const milestone = (year: string, title: string, text: string): [string, string][] => [
  ["milestoneYear", year],
  ["milestoneTitle", title],
  ["milestoneText", text],
];

describe("aboutPageSchema", () => {
  const about = (extra: [string, string][]) => aboutPageSchema.safeParse(readAboutForm(form([...top, ...extra])));

  it("keeps filled rows, drops empty ones and reads the section headings", () => {
    const result = about([
      ["founderAuthorId", ID],
      ["storyText", rich("Our founder grew up in the mountains.")],
      ["storyPhotoId", ID],
      ["storyPhotoId", ""],
      ["storyPhotoId", ID],
      ["promisesHeading", "What you can expect from us"],
      ["teamIntro", "Local guides."],
      ...milestone("2015", "Founded", "In Kathmandu."),
      ...milestone("", "", ""),
      ["promiseIcon", "price_check"],
      ["promiseTitle", "Clear prices"],
      ["promiseText", "No surprises."],
    ]);
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      heading: "A Nepali team",
      founderAuthorId: ID,
      photoId: null,
      storyText: { type: "doc" },
      storyPhotoIds: [ID],
      promisesHeading: "What you can expect from us",
      teamIntro: "Local guides.",
      milestones: [{ year: "2015", title: "Founded", text: "In Kathmandu." }],
      promises: [{ icon: "price_check", title: "Clear prices", text: "No surprises." }],
    });
  });

  it("needs a heading, and a title for a moment with words", () => {
    const result = aboutPageSchema.safeParse(readAboutForm(form([["heading", ""], ...milestone("", "", ""), ...milestone("2020", "", "Moved office.")])));
    expect(result.success).toBe(false);
    const errors = toFieldErrors(result.error!);
    expect(errors).toHaveProperty("heading");
    expect(errors).toHaveProperty(["milestones.1.title"]);
  });

  it("allows at most four moments", () => {
    const moments = [1, 2, 3, 4, 5].flatMap((n) => milestone(String(2010 + n), `Moment ${n}`, ""));
    expect(toFieldErrors(about(moments).error!)).toHaveProperty("milestones");
  });

  it("rejects an icon that is not in the list, an id that is not a library id, and a story that is not rich text", () => {
    const result = about([
      ["founderAuthorId", "../../etc"],
      ["storyText", "<script>alert(1)</script>"],
      ["promiseIcon", "rocket"],
      ["promiseTitle", "Fast"],
      ["promiseText", ""],
    ]);
    expect(result.success).toBe(false);
    expect(Object.keys(toFieldErrors(result.error!))).toEqual(expect.arrayContaining(["founderAuthorId", "storyText", "promises.0.icon"]));
  });
});

describe("contactPageSchema", () => {
  const contact = (extra: [string, string][]) => contactPageSchema.safeParse(readContactForm(form([...top, ...extra])));

  it("keeps questions with answers and known places, in the list's order", () => {
    const result = contact([
      ["faqQuestion", "Is it free?"],
      ["faqAnswer", rich("Yes.")],
      ["timeZone", "America/New_York"],
      ["timeZone", "Mars/Olympus"],
      ["timeZone", "Europe/Berlin"],
      ["timeNote", "We reply first thing in the morning."],
      ["stepWhen", "Today"],
      ["stepTitle", "You write"],
      ["stepText", ""],
    ]);
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({
      faqs: [{ question: "Is it free?", answer: { type: "doc" } }],
      timeZones: ["Europe/Berlin", "America/New_York"],
      timeNote: "We reply first thing in the morning.",
      nextSteps: [{ when: "Today", title: "You write", text: "" }],
    });
  });

  it("asks for the missing half of a question, and refuses the same question twice", () => {
    const halves = contact([
      ["faqQuestion", "Is it free?"],
      ["faqAnswer", rich("")],
    ]);
    expect(toFieldErrors(halves.error!)).toHaveProperty(["faqs.0.answer"]);

    const twice = contact([
      ["faqQuestion", "Is it free?"],
      ["faqAnswer", rich("Yes.")],
      ["faqQuestion", "is it free?"],
      ["faqAnswer", rich("Still yes.")],
    ]);
    expect(toFieldErrors(twice.error!)).toHaveProperty(["faqs.1.question"]);
  });

  it("allows at most four places", () => {
    const zones = ["Europe/Berlin", "Europe/London", "Europe/Paris", "America/New_York", "Asia/Tokyo"].map((zone): [string, string] => ["timeZone", zone]);
    expect(contact(zones).success).toBe(false);
  });
});

describe("listPagesSchema", () => {
  const pageFields = (slug: string, heading: string): [string, string][] => [
    [`${slug}.eyebrow`, ""],
    [`${slug}.heading`, heading],
    [`${slug}.intro`, "{regions} trekking regions."],
    [`${slug}.seoTitle`, "Nepal treks"],
    [`${slug}.seoDescription`, ""],
    [`${slug}.seoKeyword`, "nepal treks"],
  ];

  it("reads each page's fields by its slug, keeping {regions} for the website to fill", () => {
    const result = listPagesSchema.safeParse(
      readListPagesForm(form([...pageFields("home", "Walk the Himalaya"), ...pageFields("treks", "Nepal treks"), ...pageFields("regions", "Regions"), ...pageFields("travel-guides", "Guides")])),
    );
    expect(result.success).toBe(true);
    expect(result.data?.treks).toMatchObject({ heading: "Nepal treks", intro: "{regions} trekking regions.", photoId: null });
    expect(result.data?.["travel-guides"].heading).toBe("Guides");
  });

  it("puts an error on the page it belongs to", () => {
    const result = listPagesSchema.safeParse(
      readListPagesForm(form([...pageFields("home", "Home"), ...pageFields("treks", ""), ...pageFields("regions", "Regions"), ...pageFields("travel-guides", "Guides")])),
    );
    expect(Object.keys(toFieldErrors(result.error!))).toEqual(["treks.heading"]);
  });
});
