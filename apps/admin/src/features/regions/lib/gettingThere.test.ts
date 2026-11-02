import { describe, expect, it } from "vitest";

import { mentionsFlying } from "./gettingThere";

describe("mentionsFlying", () => {
  it("finds a flight however it is written", () => {
    for (const text of ["Fly to Lukla", "Drive or fly to Pokhara", "Fly + drive", "Flight to Lukla", "Daily flights to Jomsom"]) {
      expect(mentionsFlying(text)).toBe(true);
    }
  });

  it("is false for a drive, and for words that only contain 'fly'", () => {
    for (const text of ["Drive, 7–8 hrs", "Pokhara", "Butterfly valley drive", ""]) {
      expect(mentionsFlying(text)).toBe(false);
    }
  });
});
