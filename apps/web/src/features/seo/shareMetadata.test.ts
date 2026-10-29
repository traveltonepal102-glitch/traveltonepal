import { describe, expect, it } from "vitest";

import type { SiteImageSource } from "@/lib/images";

import { shareImageOf, shareMetadata, withDefaultShareImage } from "./shareMetadata";

const libraryPhoto = (id: string, alt = "Kyanjin Gompa, Langtang region"): SiteImageSource => ({
  src: `https://photos.example.com/${id}`,
  alt,
  variantWidths: [400, 800, 1200],
});

const page = { path: "/treks/langtang-valley", title: "Langtang Valley Trek", description: "Ten days in the valley." };

describe("shareImageOf", () => {
  it("sends a library photo's 1200×630 share picture with its size", () => {
    expect(shareImageOf(libraryPhoto("p1"))).toEqual({
      url: "https://photos.example.com/p1/share.jpg",
      width: 1200,
      height: 630,
      alt: "Kyanjin Gompa, Langtang region",
    });
  });

  it("sends a /public file as it is, without a size", () => {
    expect(shareImageOf({ src: "/images/hero.jpg", alt: "Himalaya" })).toEqual({ url: "/images/hero.jpg", alt: "Himalaya" });
  });
});

describe("shareMetadata", () => {
  it("uses the first photo given: the chosen share photo before the page's own", () => {
    const { openGraph } = shareMetadata({ ...page, images: [libraryPhoto("chosen"), libraryPhoto("main")] });
    expect(openGraph).toMatchObject({ images: [{ url: "https://photos.example.com/chosen/share.jpg" }] });

    const fallback = shareMetadata({ ...page, images: [undefined, libraryPhoto("main")] });
    expect(fallback.openGraph).toMatchObject({ images: [{ url: "https://photos.example.com/main/share.jpg" }] });
  });

  it("writes the page's title, description, address, site name and language, and a large X card", () => {
    expect(shareMetadata({ ...page, images: [] })).toEqual({
      openGraph: {
        type: "website",
        siteName: "Travel To Nepal",
        locale: "en_US",
        url: "/treks/langtang-valley",
        title: "Langtang Valley Trek",
        description: "Ten days in the valley.",
      },
      twitter: { card: "summary_large_image", title: "Langtang Valley Trek", description: "Ten days in the valley." },
    });
  });

  it("marks a travel guide as an article with its dates, the update only when there is one", () => {
    expect(shareMetadata({ ...page, images: [], article: { publishedTime: "2026-03-01", modifiedTime: "2026-09-12" } }).openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-03-01",
      modifiedTime: "2026-09-12",
    });
    expect(shareMetadata({ ...page, images: [], article: { publishedTime: "2026-03-01" } }).openGraph).not.toHaveProperty("modifiedTime");
  });
});

describe("withDefaultShareImage", () => {
  const fallback = libraryPhoto("settings", "Travel To Nepal");

  it("gives a page without a photo the Site settings share image", () => {
    const metadata = withDefaultShareImage({ title: "Contact", ...shareMetadata({ ...page, images: [] }) }, fallback);
    expect(metadata.title).toBe("Contact");
    expect(metadata.openGraph).toMatchObject({ url: page.path, images: [{ url: "https://photos.example.com/settings/share.jpg" }] });
  });

  it("keeps a page's own photo, and leaves pages without share tags or without a default alone", () => {
    const own = shareMetadata({ ...page, images: [libraryPhoto("own")] });
    expect(withDefaultShareImage(own, fallback)).toBe(own);
    expect(withDefaultShareImage({}, fallback)).toEqual({});
    const bare = shareMetadata({ ...page, images: [] });
    expect(withDefaultShareImage(bare, undefined)).toBe(bare);
  });
});
