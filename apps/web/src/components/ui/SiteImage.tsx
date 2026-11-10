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
  /** next/image quality for a /public file, e.g. HERO_PHOTO_QUALITY (library photos have their own prepared files). */
  quality?: number;
  /** e.g. the photo viewer's tap to zoom. */
  onClick?: () => void;
};

/**
 * A page picture filling its box: a library photo at the prepared size that fits, or a file in /public.
 * A client component: next/image needs the size picker (a function) in the browser.
 */
export const SiteImage = ({ image, sizes, className, priority, quality, onClick }: SiteImageProps) => {
  const { variantWidths, fileName } = image;
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      quality={quality}
      preload={priority}
      fetchPriority={priority ? "high" : undefined}
      // Library photos: their own files for each width (`${src}/<file name>-<width>.webp`), not Next's image service.
      loader={variantWidths?.length ? ({ width }) => photoUrl({ baseUrl: image.src, variantWidths, fileName }, width) : undefined}
      placeholder={image.placeholder ? "blur" : "empty"}
      blurDataURL={image.placeholder}
      onClick={onClick}
      className={className}
    />
  );
};
