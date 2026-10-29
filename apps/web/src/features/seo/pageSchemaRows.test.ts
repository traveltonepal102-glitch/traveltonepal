import { describe, expect, it } from "vitest";

import type { WebPageSchemaRow } from "@/lib/supabase/database.types";

import { toPageSchemasJsonLd } from "./pageSchemaRows";

const row = (overrides: Partial<WebPageSchemaRow>): WebPageSchemaRow => ({
  page_kind: "trek",
  page_slug: "langtang-valley",
  position: 1,
  data: { "@type": "VideoObject", name: "Video" },
  ...overrides,
});

describe("toPageSchemasJsonLd", () => {
  it("joins the page's blocks into one graph, in the admin's order", () => {
    const rows = [
      row({ position: 2, data: { "@graph": [{ "@type": "HowTo" }, { "@type": "Event" }] } }),
      row({ position: 1 }),
      row({ page_slug: "everest-base-camp", data: { "@type": "Other" } }),
      row({ page_kind: "page", page_slug: "langtang-valley", data: { "@type": "Other" } }),
    ];
    expect(toPageSchemasJsonLd(rows, "trek", "langtang-valley")).toEqual({
      "@context": "https://schema.org",
      "@graph": [{ "@type": "VideoObject", name: "Video" }, { "@type": "HowTo" }, { "@type": "Event" }],
    });
  });

  it("is null for a page without blocks, and skips data that isn't an object", () => {
    expect(toPageSchemasJsonLd([row({})], "page", "home")).toBeNull();
    expect(toPageSchemasJsonLd([row({ data: "text" }), row({ data: [1] })], "trek", "langtang-valley")).toBeNull();
  });
});
