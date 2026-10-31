import { describe, expect, it } from "vitest";
import { z } from "zod";

import { toFieldErrors } from "@/lib/forms/fieldErrors";
import { EMPTY_RICH_TEXT } from "@/lib/richText/richText";
import type { MonthRating } from "@/lib/supabase/database.types";

import { emptyMonths } from "../constants";
import { storedMonths, storedSection, toStoredSection } from "../services/storedSections";
import { monthsField } from "./monthsSchema";
import { sectionsField } from "./sectionsSchema";

const doc = (text: string) => ({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text }] }] });

/** As in the travel guide form, so errors carry their "sections." and "months." paths. */
const form = z.object({ sections: sectionsField, months: monthsField });
const parse = (sections: unknown[], months: unknown[] = emptyMonths()) => form.safeParse({ sections: JSON.stringify(sections), months: JSON.stringify(months) });

const errorsOf = (sections: unknown[], months?: unknown[]) => {
  const result = parse(sections, months);
  if (result.success) throw new Error("expected the form to be rejected");
  return toFieldErrors(result.error);
};

describe("note, checklist, months and WhatsApp sections", () => {
  it("reads each kind, dropping empty checklist items", () => {
    const result = parse([
      { id: null, type: "callout", tone: "note", body: doc("Permit rule: carry your passport.") },
      { id: null, type: "check", heading: " Before you fly ", items: ["Insurance", "", "Visa"] },
      { id: null, type: "months", heading: "Month by month", view: "table" },
      { id: null, type: "cta", heading: "Trek in the best season?", buttonText: "Ask about dates", message: "Hi! I read your guide." },
    ]);
    expect(result.data?.sections).toEqual([
      { id: null, type: "callout", tone: "note", body: doc("Permit rule: carry your passport.") },
      { id: null, type: "check", heading: "Before you fly", items: ["Insurance", "Visa"] },
      { id: null, type: "months", heading: "Month by month", view: "table" },
      { id: null, type: "cta", heading: "Trek in the best season?", buttonText: "Ask about dates", message: "Hi! I read your guide." },
    ]);
  });

  it("checks what each kind needs, at the section's number", () => {
    expect(
      errorsOf([
        { id: null, type: "callout", tone: "loud", body: EMPTY_RICH_TEXT },
        { id: null, type: "check", heading: "", items: ["", " "] },
        { id: null, type: "months", heading: "", view: "grid" },
        { id: null, type: "cta", heading: "", buttonText: "", message: "" },
      ]),
    ).toMatchObject({
      "sections.0.tone": "Pick note or warning.",
      "sections.0.body": "Write the note, or remove this section.",
      "sections.1.items": "Add an item, or remove this section.",
      "sections.2.heading": "Write the heading.",
      "sections.2.view": "Pick how the months show.",
      "sections.3.heading": "Write the heading.",
      "sections.3.buttonText": "Write the button text.",
      "sections.3.message": "Write the message that opens in WhatsApp.",
    });
  });
});

describe("the guide's months", () => {
  it("needs all 12, with known ratings and crowds", () => {
    const months = emptyMonths().map((month, index) => (index === 9 ? { rating: "best", onTheTrail: "Clear skies", crowds: "busiest" } : month));
    expect(parse([], months).data?.months[9]).toEqual({ rating: "best", onTheTrail: "Clear skies", crowds: "busiest" });
    expect(errorsOf([], emptyMonths().slice(0, 11)).months).toBe("Fill in all 12 months.");
    const wrong = emptyMonths().map((month, index) => (index === 0 ? { ...month, rating: "great", crowds: "packed" } : month));
    expect(errorsOf([], wrong)).toMatchObject({ "months.0.rating": "Pick Best, Possible or Not ideal.", "months.0.crowds": "Pick the crowds from the list." });
  });

  it("reads saved months, or empty ones to fill in", () => {
    const ratings: MonthRating[] = emptyMonths().map((_, index) => (index < 2 ? "best" : "avoid"));
    const months = storedMonths(ratings, [{ onTheTrail: "Cold and clear", crowds: "low" }]);
    expect(months[0]).toEqual({ rating: "best", onTheTrail: "Cold and clear", crowds: "low" });
    expect(months[5]).toEqual({ rating: "avoid", onTheTrail: "", crowds: "" });
    expect(storedMonths(null, undefined)).toEqual(emptyMonths());
  });

  it("reads a section's settings, with a safe choice when they are missing", () => {
    expect(storedSection({ id: "s1", type: "months", trek_id: null, settings: { view: "table" } }, { heading: "Months" })).toEqual({ id: "s1", type: "months", heading: "Months", view: "table" });
    expect(storedSection({ id: "s2", type: "callout", trek_id: null, settings: {} }, { body: doc("Note.") })).toMatchObject({ tone: "warning" });
  });
});

describe("heading sections", () => {
  it("needs the heading and a known level", () => {
    const heading = { id: null, type: "heading", level: "h2", heading: " Walking times ", tocLabel: " Times " };
    expect(parse([heading]).data?.sections).toEqual([{ id: null, type: "heading", level: "h2", heading: "Walking times", tocLabel: "Times" }]);
    expect(errorsOf([{ ...heading, heading: "", level: "h4" }])).toMatchObject({ "sections.0.heading": "Write the heading.", "sections.0.level": "Pick H2 or H3." });
  });

  it("saves the level as a setting, and no short name for an H3", () => {
    const h3 = { id: null, type: "heading", level: "h3", heading: "Day one", tocLabel: "Day" } as const;
    expect(toStoredSection(h3)).toMatchObject({ settings: { level: "h3" }, content: { heading: "Day one", tocLabel: "" } });
    expect(storedSection({ id: "s1", type: "heading", trek_id: null, settings: {} }, { heading: "Walking times" })).toEqual({ id: "s1", type: "heading", level: "h2", heading: "Walking times", tocLabel: "" });
  });
});
