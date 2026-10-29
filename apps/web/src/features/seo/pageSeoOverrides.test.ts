import { describe, expect, it } from "vitest";

import type { WebPageSeoOverrideRow } from "@/lib/supabase/database.types";

import { pathsLeftOutOfSitemap, toPageSeoOverrides, withPageSeoOverrides } from "./pageSeoOverrides";
import { shareMetadata } from "./shareMetadata";

const row = (page_kind: WebPageSeoOverrideRow["page_kind"], page_slug: string, canonical_path: string, hide_from_google = false): WebPageSeoOverrideRow => ({
  page_kind,
  page_slug,
  locale: "en",
  canonical_path,
  hide_from_google,
});
const hidden = (page_kind: WebPageSeoOverrideRow["page_kind"], page_slug: string) => row(page_kind, page_slug, "", true);

const SITEMAP = new Set(["/", "/treks", "/contact", "/treks/everest-base-camp", "/treks/ebc-short", "/regions/langtang", "/travel-guides/ebc-altitude"]);

describe("toPageSeoOverrides: canonical addresses", () => {
  it("follows an address that names a page of the sitemap, keyed by each kind of page's path", () => {
    const { canonicals } = toPageSeoOverrides(
      [
        row("trek", "ebc-short", "/treks/everest-base-camp"),
        row("region", "khumbu", "/regions/langtang"),
        row("guide", "ebc-altitude-2", "/travel-guides/ebc-altitude"),
        row("page", "travel-guides", "/"),
      ],
      SITEMAP,
    );
    expect([...canonicals]).toEqual([
      ["/treks/ebc-short", "/treks/everest-base-camp"],
      ["/regions/khumbu", "/regions/langtang"],
      ["/travel-guides/ebc-altitude-2", "/travel-guides/ebc-altitude"],
      ["/travel-guides", "/"],
    ]);
  });

  it("ignores a page that isn't in the sitemap (a 404, a noindex page or a typo) and the page itself", () => {
    const { canonicals } = toPageSeoOverrides(
      [row("trek", "a", "/treks/no-such-trek"), row("trek", "b", "/impressum"), row("trek", "everest-base-camp", "/treks/everest-base-camp")],
      SITEMAP,
    );
    expect(canonicals.size).toBe(0);
  });

  it("ignores chains: a page may not name one that points elsewhere itself", () => {
    const { canonicals } = toPageSeoOverrides([row("trek", "a", "/treks/ebc-short"), row("trek", "ebc-short", "/treks/everest-base-camp")], SITEMAP);
    expect([...canonicals]).toEqual([["/treks/ebc-short", "/treks/everest-base-camp"]]);
  });

  it("ignores a fixed page it doesn't know", () => {
    expect(toPageSeoOverrides([row("page", "blog", "/")], SITEMAP).canonicals.size).toBe(0);
  });
});

describe("toPageSeoOverrides: hidden pages", () => {
  it("lists the hidden pages by path", () => {
    expect([...toPageSeoOverrides([hidden("trek", "ebc-short"), hidden("page", "contact")], SITEMAP).hidden]).toEqual(["/treks/ebc-short", "/contact"]);
  });

  it("only hides a hidden page that also has a canonical address (never both answers)", () => {
    const overrides = toPageSeoOverrides([row("trek", "ebc-short", "/treks/everest-base-camp", true)], SITEMAP);
    expect([...overrides.hidden]).toEqual(["/treks/ebc-short"]);
    expect(overrides.canonicals.size).toBe(0);
  });

  it("doesn't let a page name a hidden page as its main version", () => {
    const { canonicals } = toPageSeoOverrides([row("trek", "ebc-short", "/treks/everest-base-camp"), hidden("trek", "everest-base-camp")], SITEMAP);
    expect(canonicals.size).toBe(0);
  });

  it("leaves hidden pages and pages pointing elsewhere out of the sitemap", () => {
    const overrides = toPageSeoOverrides([hidden("page", "contact"), row("trek", "ebc-short", "/treks/everest-base-camp")], SITEMAP);
    expect([...pathsLeftOutOfSitemap(overrides)]).toEqual(["/contact", "/treks/ebc-short"]);
  });
});

describe("withPageSeoOverrides", () => {
  const page = (path: string) => ({
    title: "EBC short",
    alternates: { canonical: path },
    ...shareMetadata({ path, title: "EBC short", description: "", images: [] }),
  });
  const overrides = { hidden: new Set(["/contact"]), canonicals: new Map([["/treks/ebc-short", "/treks/everest-base-camp"]]) };

  it("points the canonical link and og:url at the main page", () => {
    const metadata = withPageSeoOverrides(page("/treks/ebc-short"), overrides);
    expect(metadata.alternates?.canonical).toBe("/treks/everest-base-camp");
    expect(metadata.openGraph).toMatchObject({ url: "/treks/everest-base-camp", title: "EBC short" });
    expect(metadata.robots).toBeUndefined();
  });

  it("asks search engines not to list a hidden page but to follow its links", () => {
    const metadata = withPageSeoOverrides(page("/contact"), overrides);
    expect(metadata.robots).toEqual({ index: false, follow: true });
    expect(metadata.alternates?.canonical).toBe("/contact");
  });

  it("leaves every other page as it is", () => {
    const own = page("/treks/everest-base-camp");
    expect(withPageSeoOverrides(own, overrides)).toBe(own);
    expect(withPageSeoOverrides({}, overrides)).toEqual({});
  });
});
