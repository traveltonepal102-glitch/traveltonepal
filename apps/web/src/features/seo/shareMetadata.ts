import { SHARE_IMAGE_SIZE, photoShareUrl } from "@ttn/ui/lib/photos";
import type { Metadata } from "next";

import type { SiteImageSource } from "@/lib/images";
import { SITE_NAME } from "@/lib/site";

/** A page's Google result and its shared links' photo (chosen in the admin's Google card), as the rows give them. */
export type PageSeo = { title: string; description: string; shareImage?: SiteImageSource };

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/** The site's language for share previews (the German site will send "de_DE"). */
export const SHARE_LOCALE = "en_US";

/**
 * The picture a shared link shows: a library photo's 1200×630 share.jpg (exact size, so apps don't crop it), or a
 * /public file as it is.
 */
export const shareImageOf = (image: SiteImageSource) =>
  image.variantWidths?.length ? { url: photoShareUrl(image.src), ...SHARE_IMAGE_SIZE, alt: image.alt } : { url: image.src, alt: image.alt };

type ShareInput = {
  path: string;
  title: string;
  description: string;
  /** In order of preference (the chosen share photo, then the page's main photo); none: Site settings' share image. */
  images: readonly (SiteImageSource | undefined)[];
  /** A travel guide: dates (YYYY-MM-DD) and type "article". */
  article?: { publishedTime: string; modifiedTime?: string };
};

/** Open Graph and X (Twitter) tags of a page: what WhatsApp, Facebook, LinkedIn and X show for a shared link. */
export const shareMetadata = ({ path, title, description, images, article }: ShareInput): Pick<Metadata, "openGraph" | "twitter"> => {
  const image = images.find((candidate) => candidate !== undefined);
  return {
    openGraph: {
      ...(article ? { type: "article", publishedTime: article.publishedTime, ...(article.modifiedTime ? { modifiedTime: article.modifiedTime } : {}) } : { type: "website" }),
      siteName: SITE_NAME,
      locale: SHARE_LOCALE,
      url: path,
      title,
      description,
      ...(image ? { images: [shareImageOf(image)] } : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
};

const hasImages = (openGraph: OpenGraph) => "images" in openGraph && openGraph.images !== undefined;

/**
 * Gives a page without a photo of its own the share image from Site settings (a page's openGraph replaces the
 * layout's whole, so the default can't live only there). Pages with no openGraph (e.g. a 404) are left as they are.
 */
export const withDefaultShareImage = (metadata: Metadata, defaultImage: SiteImageSource | undefined): Metadata => {
  const { openGraph } = metadata;
  if (!openGraph || !defaultImage || hasImages(openGraph)) return metadata;
  return { ...metadata, openGraph: { ...openGraph, images: [shareImageOf(defaultImage)] } };
};
