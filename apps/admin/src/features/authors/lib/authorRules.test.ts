import { describe, expect, it } from "vitest";

import { EMPTY_AUTHOR_VALUES } from "../constants";
import type { Author, AuthorGuide } from "../types";
import { authorPerson, filterAuthors, firstName, isVerified } from "./authorRules";

const GUIDES: AuthorGuide[] = [{ id: "g1", name: "Pemba Tamang", photo: null, bio: "Born below Kyanjin.", hasConsent: true }];

const author = (overrides: Partial<Author>): Author => ({ ...EMPTY_AUTHOR_VALUES, id: "a", photo: null, updatedAt: "", ...overrides });

const AUTHORS = [
  author({ id: "office", name: "Sujan Sherpa", jobTitle: "Founder", topics: ["Planning & permits"] }),
  author({ id: "guide", kind: "guide", guideId: "g1", jobTitle: "Senior trek leader", topics: ["Langtang"] }),
  author({ id: "guest", kind: "guest", name: "Anna Weber", jobTitle: "Travel writer", writesIn: ["de"] }),
];

const ids = (authors: Author[]) => authors.map((item) => item.id);
const all = { query: "", kind: "" as const, language: "" as const };

describe("authorPerson", () => {
  it("takes a guide author's name, photo and bio from their guide", () => {
    expect(authorPerson(AUTHORS[1], GUIDES)).toEqual({ name: "Pemba Tamang", photo: null, bio: "Born below Kyanjin." });
    expect(authorPerson({ ...AUTHORS[0], bio: "20 years." }, GUIDES)).toEqual({ name: "Sujan Sherpa", photo: null, bio: "20 years." });
    expect(authorPerson({ ...AUTHORS[1], guideId: "gone" }, GUIDES).name).toBe("");
  });

  it("gives the office team and guides the blue tick, and finds the first name", () => {
    expect([isVerified("office"), isVerified("guide"), isVerified("guest")]).toEqual([true, true, false]);
    expect(firstName(" Pemba Tamang ")).toBe("Pemba");
  });
});

describe("filterAuthors", () => {
  it("sorts by the name shown, and searches names, job titles and topics", () => {
    expect(ids(filterAuthors(AUTHORS, GUIDES, all))).toEqual(["guest", "guide", "office"]);
    expect(ids(filterAuthors(AUTHORS, GUIDES, { ...all, query: "pemba" }))).toEqual(["guide"]);
    expect(ids(filterAuthors(AUTHORS, GUIDES, { ...all, query: "permits" }))).toEqual(["office"]);
  });

  it("filters by kind and by the language they write in", () => {
    expect(ids(filterAuthors(AUTHORS, GUIDES, { ...all, kind: "guest" }))).toEqual(["guest"]);
    expect(ids(filterAuthors(AUTHORS, GUIDES, { ...all, language: "de" }))).toEqual(["guest"]);
  });
});
