import type { WebPageSeoOverrideRow } from "@ttn/site-data/database.types";
import { describe, expect, it } from "vitest";

import { toPageSeoOverrides } from "./pageSeoOverrides";

const row = (page_slug: string, canonical_path: string, hide_from_google = false, page_kind: WebPageSeoOverrideRow["page_kind"] = "trek"): WebPageSeoOverrideRow => ({ page_kind, page_slug, locale: "en", canonical_path, hide_from_google });
const LISTED = new Set(["/", "/a", "/b", "/c", "/d", "/e"]);

describe("toPageSeoOverrides", () => {
  it("follows an address that names a listed page, for treks and blogs", () => {
    const { canonicals } = toPageSeoOverrides([row("a", "/b"), row("c", "/e", false, "guide")], LISTED);
    expect(canonicals.get("/a")).toBe("/b");
    expect(canonicals.get("/c")).toBe("/e");
  });

  it("only hides a hidden page, ignoring its address", () => {
    const { hidden, canonicals } = toPageSeoOverrides([row("a", "/b", true)], LISTED);
    expect(hidden.has("/a")).toBe(true);
    expect(canonicals.size).toBe(0);
  });

  it("ignores an unknown page, the page itself, a hidden page and a chain", () => {
    const { canonicals } = toPageSeoOverrides([row("a", "/nowhere"), row("b", "/b"), row("c", "/a"), row("e", "/d"), row("d", "", true)], LISTED);
    expect(canonicals.size).toBe(0);
  });

  it("leaves other kinds of page alone", () => {
    expect(toPageSeoOverrides([row("about", "", true, "page"), row("x", "", true, "region")], LISTED).hidden.size).toBe(0);
  });
});
