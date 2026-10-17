"use client";

import Image from "next/image";

import type { TrekPhoto } from "../../types";

type GalleryThumbnailsProps = {
  photos: readonly TrekPhoto[];
  activeIndex: number;
  onSelect: (index: number) => void;
  /** Opens the full-screen viewer at this photo (the "+N" thumbnail). */
  onShowAll: (index: number) => void;
};

/** Thumbnails shown in the row; with more photos than this, the last one becomes "+N" and opens the viewer. */
const MAX_THUMBNAILS = 6;

const BUTTON =
  "relative block aspect-4/3 w-full cursor-pointer overflow-hidden rounded-md bg-line-strong transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** One button per photo; the shown photo is outlined. */
export const GalleryThumbnails = ({ photos, activeIndex, onSelect, onShowAll }: GalleryThumbnailsProps) => {
  const hasMore = photos.length > MAX_THUMBNAILS;

  return (
    <ul className="grid grid-cols-6 gap-2">
      {photos.slice(0, MAX_THUMBNAILS).map((photo, index) => {
        const isMore = hasMore && index === MAX_THUMBNAILS - 1;
        const isActive = index === activeIndex && !isMore;
        return (
          <li key={photo.src}>
            <button
              type="button"
              onClick={() => (isMore ? onShowAll(index) : onSelect(index))}
              aria-label={isMore ? `See all ${photos.length} photos` : `Show photo ${index + 1}: ${photo.alt}`}
              aria-current={isActive || undefined}
              className={`${BUTTON} ${isActive ? "ring-2 ring-brand" : "border border-line opacity-85 hover:opacity-100"}`}
            >
              <Image src={photo.src} alt="" fill sizes="(min-width: 1024px) 130px, 16vw" className="object-cover" />
              {isMore && (
                <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-navy/62 text-body-sm font-extrabold text-white">
                  +{photos.length - (MAX_THUMBNAILS - 1)}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
};
