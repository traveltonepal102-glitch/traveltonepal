import { describe, expect, it } from "vitest";

import { leaveSaveChoice, leavingPath } from "./leaveGuard";

const EDITOR = "https://admin.example.com/treks/abc";

describe("leavingPath", () => {
  it("returns the admin page a link opens", () => {
    expect(leavingPath("/treks", EDITOR)).toBe("/treks");
    expect(leavingPath("https://admin.example.com/pages/lists?page=home#top", EDITOR)).toBe("/pages/lists?page=home#top");
  });

  it("ignores links that stay on this page or go to another site", () => {
    expect(leavingPath("#faq", EDITOR)).toBeNull();
    expect(leavingPath("/treks/abc", EDITOR)).toBeNull();
    expect(leavingPath("https://traveltonepal.com/treks", EDITOR)).toBeNull();
  });

  it("counts another query on the same page as leaving", () => {
    expect(leavingPath("/treks/abc?copied=1", EDITOR)).toBe("/treks/abc?copied=1");
  });
});

describe("leaveSaveChoice", () => {
  it("offers to save a draft, which stays off the website", () => {
    expect(leaveSaveChoice("draft", "Save changes")).toEqual({ label: "Save as draft", note: expect.stringContaining("Published") });
  });

  it("warns that saving a published item changes the website", () => {
    expect(leaveSaveChoice("published", "Save changes")).toEqual({ label: "Save changes", note: expect.stringContaining("on the website straight away") });
  });

  it("keeps the editor's own words without a status", () => {
    expect(leaveSaveChoice(null, "Publish")).toEqual({ label: "Publish", note: "Your changes show on the website only after you publish them." });
    expect(leaveSaveChoice(null, "Save changes").note).toBe("Your changes show on the website only after you save them.");
  });
});
