import { describe, expect, it } from "vitest";

import { languageName } from "./languageNames";

describe("languageName", () => {
  it("writes the languages typed in English in German", () => {
    expect(["English", "Nepali", "japanese", " German "].map(languageName)).toEqual(["Englisch", "Nepali", "Japanisch", "Deutsch"]);
  });

  it("keeps a name it doesn't know as typed", () => {
    expect(languageName("Gurung")).toBe("Gurung");
  });
});
