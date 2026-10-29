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

describe("aboutPageSchema", () => {
  const about = (extra: [string, string][]) => aboutPageSchema.safeParse(readAboutForm(form([...top, ...extra])));

  it("reads every section by its field paths, with the photos in their places", () => {
    const result = about([
      ["founderAuthorId", ID],
      ["storyText", rich("Sandip was born in Tanahun.")],
      ["photoIds.0", ID],
      ["photoIds.3", ID],
      ["statValue", "All"],
      ["listen.heading", "We understand you first."],
      ["listen.steps.0.title", "1. We listen"],
      ["listen.questions.2", "What should this trip mean for you?"],
      ["listen.understand.1.label", "Your interests"],
      ["honest.advice.0.quote", "Langtang may suit you better."],
      ["flexible.stages.3.title", "After the trek"],
      ["openMind.places.0.title", "Ghandruk, Annapurna"],
      ["safety.facts.2.title", "Rescue plan"],
      ["goals.1.title", "Places that deserve attention"],
      ["teamIntro", "Local guides."],
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
      photoIds: [ID, null, null, ID, null],
      statValue: "All",
      listen: { heading: "We understand you first.", questions: ["", "", "What should this trip mean for you?", ""] },
      teamIntro: "Local guides.",
      promises: [{ icon: "price_check", title: "Clear prices", text: "No surprises." }],
    });
    expect(result.data?.listen.steps[0]).toEqual({ title: "1. We listen", text: "" });
    expect(result.data?.listen.understand[1]).toEqual({ label: "Your interests", value: "" });
    expect(result.data?.honest.advice[0].quote).toBe("Langtang may suit you better.");
    expect(result.data?.flexible.stages[3].title).toBe("After the trek");
    expect(result.data?.openMind.places[0].title).toBe("Ghandruk, Annapurna");
    expect(result.data?.safety.facts[2].title).toBe("Rescue plan");
    expect(result.data?.goals[1].title).toBe("Places that deserve attention");
  });

  it("needs a heading, and names a field that is too long by its path", () => {
    const result = aboutPageSchema.safeParse(readAboutForm(form([["heading", ""], ["honest.points.1.title", "x".repeat(200)]])));
    expect(result.success).toBe(false);
    const errors = toFieldErrors(result.error!);
    expect(errors).toHaveProperty("heading");
    expect(errors).toHaveProperty(["honest.points.1.title"]);
  });

  it("rejects an icon that is not in the list, an id that is not a library id, and a story that is not rich text", () => {
    const result = about([
      ["founderAuthorId", "../../etc"],
      ["photoIds.1", "not-an-id"],
      ["storyText", "<script>alert(1)</script>"],
      ["promiseIcon", "rocket"],
      ["promiseTitle", "Fast"],
      ["promiseText", ""],
    ]);
    expect(result.success).toBe(false);
    expect(Object.keys(toFieldErrors(result.error!))).toEqual(expect.arrayContaining(["founderAuthorId", "photoIds.1", "storyText", "promises.0.icon"]));
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

  it("reads each page's Google settings: canonical address and Hide from Google", () => {
    const result = listPagesSchema.safeParse(
      readListPagesForm(
        form([
          ...pageFields("home", "Walk the Himalaya"),
          ...pageFields("treks", "Nepal treks"),
          ["treks.canonicalPath", " /Regions/ "],
          ["treks.hideFromGoogle", "on"],
          ...pageFields("regions", "Regions"),
          ...pageFields("travel-guides", "Guides"),
        ]),
      ),
    );
    expect(result.data?.treks).toMatchObject({ canonicalPath: "/regions", hideFromGoogle: true });
    expect(result.data?.home).toMatchObject({ canonicalPath: "", hideFromGoogle: false });
  });

  it("puts an error on the page it belongs to", () => {
    const result = listPagesSchema.safeParse(
      readListPagesForm(form([...pageFields("home", "Home"), ...pageFields("treks", ""), ...pageFields("regions", "Regions"), ...pageFields("travel-guides", "Guides")])),
    );
    expect(Object.keys(toFieldErrors(result.error!))).toEqual(["treks.heading"]);
  });
});
