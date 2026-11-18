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

/** The first photo is the page's largest picture (LCP): about two thirds of the column beside the booking card. */
const MAIN_SIZES = "(min-width: 1024px) 560px, 66vw";
const THUMB_SIZES = "(min-width: 1024px) 280px, 33vw";
const TILE = "relative m-0 overflow-hidden rounded-[22px] bg-maroon-tint";
const OPEN = "absolute inset-0 block size-full cursor-zoom-in border-0 bg-transparent p-0 focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-saffron";

/**
 * The photo mosaic (design: one large photo and two beside it): the page's chosen photo first, then the trek's. Each
 * photo opens full size in the viewer, one at a time; the last tile is darkened with "+N photos" and opens the first
 * photo not shown. Fills the height beside the booking card.
 */
export const HomeGallery = ({ main, photos, title }: HomeGalleryProps) => {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const all = main ? [main, ...photos.filter((photo) => photo.src !== main.src)] : [...photos];
  const [first, ...rest] = all;
  if (!first) return null;
  const thumbs = rest.slice(0, 2);
  const hidden = all.length - 1 - thumbs.length;

  return (
    <div className={`grid min-h-95 flex-1 gap-3 max-sm:min-h-0 ${thumbs.length ? "grid-cols-[minmax(0,2fr)_minmax(0,1fr)] grid-rows-2 max-sm:grid-cols-2 max-sm:grid-rows-[240px_150px]" : "grid-cols-1 max-sm:h-60"}`}>
      <figure className={`${TILE} ${thumbs.length ? "row-span-2 max-sm:col-span-2 max-sm:row-span-1" : ""}`}>
        {/* The image keeps its own text: Google Images reads it, not the button's label. */}
        <button type="button" onClick={() => setViewerIndex(0)} aria-label={`Open photo full size: ${first.alt}`} className={OPEN}>
          <SiteImage image={first} sizes={MAIN_SIZES} isPriority className="object-cover" />
        </button>
        {first.caption && <figcaption className="pointer-events-none absolute bottom-4 left-4 max-w-[80%] truncate rounded-full bg-ink/60 px-3.5 py-1.5 text-sm leading-4.5 font-semibold text-paper backdrop-blur-sm max-sm:hidden">{first.caption}</figcaption>}
      </figure>
      {thumbs.map((photo, index) => {
        const isLast = index === thumbs.length - 1 && hidden > 0;
        const position = index + 1;
        return (
          <figure key={photo.src} className={`${TILE} ${thumbs.length === 1 ? "row-span-2 max-sm:row-span-1" : ""}`}>
            <button
              type="button"
              onClick={() => setViewerIndex(isLast ? position + 1 : position)}
              aria-label={isLast ? `Open all ${all.length} photos` : `Open photo full size: ${photo.alt}`}
              className={OPEN}
            >
              <SiteImage image={photo} sizes={THUMB_SIZES} className="object-cover" />
              {/* Design: a dark overlay with white words in the middle, so it is clear there are more. */}
              {isLast && (
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-snow transition-colors hover:bg-black/70">
                  <TrailIcon name="grid" size={28} />
                  <span className="text-[28px] leading-none font-semibold">+{hidden} photos</span>
                  <span className="rounded-full border-[1.5px] border-solid border-white/80 px-4 py-1.5 text-[15px] leading-none font-semibold">View all {all.length}</span>
                </span>
              )}
            </button>
          </figure>
        );
      })}
      <PhotoViewer photos={all} title={title} index={viewerIndex} onIndexChange={setViewerIndex} />
    </div>
  );
};
