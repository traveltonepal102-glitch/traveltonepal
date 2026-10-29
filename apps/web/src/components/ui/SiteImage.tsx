"use client";

import { photoUrl } from "@ttn/ui/lib/photos";
import Image from "next/image";

import type { SiteImageSource } from "@/lib/images";

type SiteImageProps = {
  image: SiteImageSource;
  /** How wide it shows, e.g. "(min-width: 768px) 300px, 85vw", so the browser picks the right size. */
  sizes: string;
  className?: string;
  /** The page's main photo (its Largest Contentful Paint): preloaded from the <head> and fetched first. */
  priority?: boolean;
  /** e.g. the photo viewer's tap to zoom. */
  onClick?: () => void;
};

/**
 * A page picture filling its box: a library photo at the prepared size that fits, or a file in /public.
 * A client component: next/image needs the size picker (a function) in the browser.
 */
export const SiteImage = ({ image, sizes, className, priority, onClick }: SiteImageProps) => {
  const { variantWidths } = image;
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      preload={priority}
      fetchPriority={priority ? "high" : undefined}
      // Library photos: their own files for each width (`${src}/<width>.webp`), not Next's image service.
      loader={variantWidths?.length ? ({ width }) => photoUrl({ baseUrl: image.src, variantWidths }, width) : undefined}
      placeholder={image.placeholder ? "blur" : "empty"}
      blurDataURL={image.placeholder}
      onClick={onClick}
      className={className}
    />
  );
};
