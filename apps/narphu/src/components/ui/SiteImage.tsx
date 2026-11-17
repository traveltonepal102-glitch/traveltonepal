"use client";

import type { SiteImageSource } from "@ttn/site-data/images";
import { photoUrl } from "@ttn/ui/lib/photos";
import Image from "next/image";

type SiteImageProps = {
  image: SiteImageSource;
  /** How wide it shows, e.g. "(min-width: 768px) 300px, 85vw", so the browser picks the right size. */
  sizes: string;
  className?: string;
  /** The page's main photo: preloaded and fetched first. */
  isPriority?: boolean;
};

/** A library photo filling its box, at the prepared size that fits (a client component: the size picker is a function). */
export const SiteImage = ({ image, sizes, className, isPriority }: SiteImageProps) => {
  const { variantWidths, fileName } = image;
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      preload={isPriority}
      fetchPriority={isPriority ? "high" : undefined}
      loader={variantWidths?.length ? ({ width }) => photoUrl({ baseUrl: image.src, variantWidths, fileName }, width) : undefined}
      placeholder={image.placeholder ? "blur" : "empty"}
      blurDataURL={image.placeholder}
      className={className}
    />
  );
};
