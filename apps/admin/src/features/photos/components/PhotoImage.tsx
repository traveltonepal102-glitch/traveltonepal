"use client";

import Image from "next/image";

import { photoUrl } from "../lib/variants";
import type { Photo } from "../types";

type PhotoImageProps = {
  photo: Photo;
  alt: string;
  /** How wide it shows, so the browser downloads only the size it needs, e.g. "(min-width: 1101px) 280px, 50vw". */
  sizes: string;
  className?: string;
};

/** A library photo at the right size: the browser picks the smallest prepared WebP that fills the space. */
export const PhotoImage = ({ photo, alt, sizes, className }: PhotoImageProps) => (
  <Image
    // The photo's folder; the loader turns it into the file for each width (`${baseUrl}/<width>.webp`).
    src={photo.baseUrl}
    loader={({ width }) => photoUrl(photo, width)}
    width={photo.width}
    height={photo.height}
    sizes={sizes}
    alt={alt}
    placeholder={photo.placeholder ? "blur" : "empty"}
    blurDataURL={photo.placeholder || undefined}
    className={className}
  />
);
