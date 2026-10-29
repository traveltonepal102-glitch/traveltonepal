import { describe, expect, it } from "vitest";

import type { WebCanonicalOverrideRow } from "@/lib/supabase/database.types";

import { toCanonicalOverrides, withCanonicalOverride } from "./canonicals";
import { shareMetadata } from "./shareMetadata";

const row = (page_kind: WebCanonicalOverrideRow["page_kind"], page_slug: string, canonical_path: string): WebCanonicalOverrideRow => ({
  page_kind,
  page_slug,
  locale: "en",
  canonical_path,
});

const SITEMAP = new Set(["/", "/treks", "/treks/everest-base-camp", "/treks/ebc-short", "/regions/langtang", "/travel-guides/ebc-altitude"]);

describe("toCanonicalOverrides", () => {
  it("follows an address that names a page of the sitemap, keyed by each kind of page's path", () => {
    const overrides = toCanonicalOverrides(
      [
        row("trek", "ebc-short", "/treks/everest-base-camp"),
        row("region", "khumbu", "/regions/langtang"),
        row("guide", "ebc-altitude-2", "/travel-guides/ebc-altitude"),
        row("page", "travel-guides", "/"),
      ],
      SITEMAP,
    );
    expect([...overrides]).toEqual([
      ["/treks/ebc-short", "/treks/everest-base-camp"],
      ["/regions/khumbu", "/regions/langtang"],
      ["/travel-guides/ebc-altitude-2", "/travel-guides/ebc-altitude"],
      ["/travel-guides", "/"],
    ]);
  });

  it("ignores a page that isn't in the sitemap (a 404, a noindex page or a typo) and the page itself", () => {
    const overrides = toCanonicalOverrides(
      [row("trek", "a", "/treks/no-such-trek"), row("trek", "b", "/impressum"), row("trek", "everest-base-camp", "/treks/everest-base-camp")],
      SITEMAP,
    );
    expect(overrides.size).toBe(0);
  });

  it("ignores chains: a page may not name one that points elsewhere itself", () => {
    const overrides = toCanonicalOverrides([row("trek", "a", "/treks/ebc-short"), row("trek", "ebc-short", "/treks/everest-base-camp")], SITEMAP);
    expect([...overrides]).toEqual([["/treks/ebc-short", "/treks/everest-base-camp"]]);
  });

  it("ignores a fixed page it doesn't know", () => {
    expect(toCanonicalOverrides([row("page", "blog", "/")], SITEMAP).size).toBe(0);
  });
});

describe("withCanonicalOverride", () => {
  const page = (path: string) => ({
    title: "EBC short",
    alternates: { canonical: path },
    ...shareMetadata({ path, title: "EBC short", description: "", images: [] }),
  });
  const overrides = new Map([["/treks/ebc-short", "/treks/everest-base-camp"]]);

  it("points the canonical link and og:url at the main page", () => {
    const metadata = withCanonicalOverride(page("/treks/ebc-short"), overrides);
    expect(metadata.alternates?.canonical).toBe("/treks/everest-base-camp");
    expect(metadata.openGraph).toMatchObject({ url: "/treks/everest-base-camp", title: "EBC short" });
  });

  it("leaves every other page as it is", () => {
    const own = page("/treks/everest-base-camp");
    expect(withCanonicalOverride(own, overrides)).toBe(own);
    expect(withCanonicalOverride({}, overrides)).toEqual({});
  });
});
