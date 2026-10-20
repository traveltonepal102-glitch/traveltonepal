import { describe, expect, it } from "vitest";

import { CUSTOM_TREK, EMPTY_TRIP, MAX_LENGTHS, buildTripMessage, tripEmailSubject } from "./tripMessage";

describe("buildTripMessage", () => {
  it("writes the defaults when nothing is filled in", () => {
    expect(buildTripMessage(EMPTY_TRIP)).toBe(
      "Hi Travel To Nepal! I would like to plan a trek.\nTrek: Not sure yet, please suggest\nWhen: Not sure yet\nGroup: 2 people",
    );
  });

  it("introduces the visitor and adds their question after a blank line", () => {
    const message = buildTripMessage({
      ...EMPTY_TRIP,
      name: "  Anna ",
      country: "Germany",
      trek: "Langtang Valley Trek",
      when: "October – November (autumn)",
      group: "Just me",
      note: "Is it OK for a first trek?",
    });
    expect(message).toBe(
      "Hi Travel To Nepal! I am Anna from Germany.\nTrek: Langtang Valley Trek\nWhen: October – November (autumn)\nGroup: Just me\n\nIs it OK for a first trek?",
    );
  });

  it("leaves out the country without a name, and caps long text", () => {
    expect(buildTripMessage({ ...EMPTY_TRIP, country: "Germany" })).toContain("I would like to plan a trek.");
    const long = buildTripMessage({ ...EMPTY_TRIP, note: "x".repeat(MAX_LENGTHS.note + 50) });
    expect(long.split("\n").at(-1)).toHaveLength(MAX_LENGTHS.note);
  });
});

describe("tripEmailSubject", () => {
  it("names a chosen trek only", () => {
    expect(tripEmailSubject({ trek: "Langtang Valley Trek" })).toBe("Trek enquiry: Langtang Valley Trek");
    expect(tripEmailSubject(EMPTY_TRIP)).toBe("Trek enquiry");
    expect(tripEmailSubject({ trek: CUSTOM_TREK })).toBe("Trek enquiry");
  });
});
