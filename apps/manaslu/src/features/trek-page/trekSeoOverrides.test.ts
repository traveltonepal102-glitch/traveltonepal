import type { WebPageSeoOverrideRow } from "@ttn/site-data/database.types";
import { describe, expect, it } from "vitest";

import { toTrekSeoOverrides } from "./trekSeoOverrides";

const row = (page_slug: string, canonical_path: string, hide_from_google = false): WebPageSeoOverrideRow => ({ page_kind: "trek", page_slug, locale: "en", canonical_path, hide_from_google });
const LISTED = new Set(["/", "/a", "/b", "/c"]);

describe("toTrekSeoOverrides", () => {
  it("follows an address that names a listed page", () => {
    expect(toTrekSeoOverrides([row("a", "/b")], LISTED).canonicals.get("a")).toBe("/b");
  });

  it("only hides a hidden trek, ignoring its address", () => {
    const { hidden, canonicals } = toTrekSeoOverrides([row("a", "/b", true)], LISTED);
    expect(hidden.has("a")).toBe(true);
    expect(canonicals.size).toBe(0);
  });

  it("ignores an unknown page, the trek itself, a hidden trek and a chain", () => {
    const { canonicals } = toTrekSeoOverrides([row("a", "/nowhere"), row("b", "/b"), row("c", "/a"), row("d", "/e", true), row("f", "/e")], new Set([...LISTED, "/e", "/d"]));
    expect(canonicals.get("a")).toBeUndefined();
    expect(canonicals.get("b")).toBeUndefined();
    expect(canonicals.get("c")).toBeUndefined();
    expect(canonicals.get("f")).toBe("/e");
    expect(toTrekSeoOverrides([row("a", "/d"), row("d", "", true)], new Set(["/d"])).canonicals.size).toBe(0);
  });

  it("leaves pages other than treks alone", () => {
    const { hidden } = toTrekSeoOverrides([{ ...row("about", "", true), page_kind: "page" }], LISTED);
    expect(hidden.size).toBe(0);
  });
});
