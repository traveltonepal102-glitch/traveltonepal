"use client";

import type { SiteImageSource } from "@ttn/site-data/images";
import { useState } from "react";

import { PhotoViewer } from "@/components/shared/photo-viewer/PhotoViewer";
import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";

type HomeGalleryProps = {
  main?: SiteImageSource;
  photos: readonly SiteImageSource[];
  /** The trek's name, in the viewer's top bar. */
  title: string;
};

/** The biggest the first photo shows beside the others, and alone (the page's whole width). */
const MAIN_SIZES = "(min-width: 1440px) 930px, (min-width: 768px) 65vw, 100vw";
const ALONE_SIZES = "(min-width: 1440px) 1392px, 100vw";
const THUMB_SIZES = "(min-width: 768px) 460px, 1px";
const TILE = "relative block cursor-zoom-in border-0 bg-forest-tint p-0 focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-saffron";

const layoutFor = (thumbs: number) => {
  if (thumbs === 0) return "grid-cols-1";
  if (thumbs < 4) return "md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]";
  return "md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]";
};

/**
 * The chosen photo large, with up to four of the trek's beside it (a phone shows only the large one), and "All photos".
 * Each photo opens full size in the viewer, one at a time (as on Travel To Nepal); "All photos" opens it at the first.
 */
export const HomeGallery = ({ main, photos, title }: HomeGalleryProps) => {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [first, ...rest] = main ? [main, ...photos.filter((photo) => photo.src !== main.src)] : photos;
  if (!first) return null;
  const count = rest.length >= 4 ? 4 : Math.min(rest.length, 2);
  const thumbs = rest.slice(0, count);
  const all = [first, ...rest];

  return (
    <div className={`relative grid h-70 grid-cols-1 gap-2 overflow-hidden rounded-2xl md:h-112 md:grid-rows-2 ${layoutFor(count)}`}>
      {/* The images keep their own text: Google Images reads it, not the buttons' labels. */}
      <button type="button" onClick={() => setViewerIndex(0)} aria-label={`Open photo full size: ${first.alt}`} className={`${TILE} md:row-span-2`}>
        <SiteImage image={first} sizes={count === 0 ? ALONE_SIZES : MAIN_SIZES} isPriority className="object-cover" />
      </button>
      {thumbs.map((photo, index) => (
        <button
          key={photo.src}
          type="button"
          onClick={() => setViewerIndex(index + 1)}
          aria-label={`Open photo full size: ${photo.alt}`}
          className={`${TILE} hidden md:block ${count === 1 ? "md:row-span-2" : ""}`}
        >
          <SiteImage image={photo} sizes={THUMB_SIZES} className="object-cover" />
        </button>
      ))}
      {all.length > 1 && (
        <button type="button" onClick={() => setViewerIndex(0)} className="absolute right-4 bottom-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[10px] border-0 bg-snow px-4 text-[15px] font-semibold text-ink shadow-card">
          <TrailIcon name="grid" />
          All photos ({all.length})
        </button>
      )}
      <PhotoViewer photos={all} title={title} index={viewerIndex} onIndexChange={setViewerIndex} />
    </div>
  );
};
