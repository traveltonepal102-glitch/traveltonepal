"use client";

import { Icon } from "@ttn/ui/icon";
import { useState } from "react";

import { PhotoViewer } from "@/components/shared/photo-viewer/PhotoViewer";
import { SiteImage } from "@/components/ui/SiteImage";

import type { RegionPhoto } from "../types";

/** Grid cells: one big photo then four small ones (phones: big on top, two rows of two, fifth hidden). */
const CELLS = ["col-span-2 md:col-span-1 md:row-span-2", "", "", "", "max-md:hidden"] as const;

type RegionPhotoGridProps = { photos: readonly RegionPhoto[]; title: string };

/** Mosaic of the first five photos; each opens the full-screen viewer, which has all of them. */
export const RegionPhotoGrid = ({ photos, title }: RegionPhotoGridProps) => {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 grid-rows-[180px_120px_120px] gap-2.5 md:grid-cols-[2fr_1fr_1fr] md:grid-rows-[200px_200px]">
        {photos.slice(0, CELLS.length).map((photo, index) => (
          <li key={photo.src} className={CELLS[index]}>
            <button
              type="button"
              onClick={() => setViewerIndex(index)}
              // The name starts with the words shown on the button (the first one shows "View all … photos").
              aria-label={index === 0 ? `View all ${photos.length} photos, starting with ${photo.alt}` : `Open photo: ${photo.alt}`}
              className="group relative block size-full cursor-zoom-in overflow-hidden rounded-lg bg-line-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <SiteImage
                image={{ ...photo, alt: "" }}
                sizes={index === 0 ? "(min-width: 768px) 600px, 100vw" : "(min-width: 768px) 300px, 50vw"}
                className="object-cover transition-transform duration-300 group-hover:scale-104"
              />
              {index === 0 && (
                <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.75 text-caption font-bold text-white">
                  <Icon name="photo_library" size={16} />
                  View all {photos.length} photos
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      <PhotoViewer
        photos={photos.map(({ place, ...photo }) => ({ ...photo, caption: place }))}
        title={title}
        index={viewerIndex}
        onIndexChange={setViewerIndex}
      />
    </>
  );
};
