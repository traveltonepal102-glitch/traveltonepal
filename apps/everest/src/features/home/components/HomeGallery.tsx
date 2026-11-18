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

/** Under the hero, as wide as the page: the large photo about two thirds of it, the two beside it a third. */
const MAIN_SIZES = "(min-width: 1280px) 820px, 66vw";
const THUMB_SIZES = "(min-width: 1280px) 410px, 33vw";
const TILE = "relative m-0 overflow-hidden rounded-[22px] bg-ocean-tint";
const OPEN = "absolute inset-0 block size-full cursor-zoom-in border-0 bg-transparent p-0 focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-glacier";

/**
 * The photo mosaic under the hero (design: Überblick, one large photo and two beside it): the trek's photos, the hero's
 * own left out. Each photo opens full size in the viewer, one at a time (as on Travel To Nepal); the last tile is
 * darkened with "+N Fotos" and opens the first photo not shown.
 */
export const HomeGallery = ({ main, photos, title }: HomeGalleryProps) => {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const all = main ? [main, ...photos.filter((photo) => photo.src !== main.src)] : [...photos];
  const [first, ...rest] = all;
  if (!first) return null;
  const thumbs = rest.slice(0, 2);
  const hidden = all.length - 1 - thumbs.length;

  return (
    <div className={`grid min-h-110 gap-3 max-sm:min-h-0 ${thumbs.length ? "grid-cols-[minmax(0,2fr)_minmax(0,1fr)] grid-rows-2 max-sm:grid-cols-2 max-sm:grid-rows-[240px_150px]" : "grid-cols-1 max-sm:h-60"}`}>
      <figure className={`${TILE} ${thumbs.length ? "row-span-2 max-sm:col-span-2 max-sm:row-span-1" : ""}`}>
        {/* The image keeps its own text: Google Images reads it, not the button's label. */}
        <button type="button" onClick={() => setViewerIndex(0)} aria-label={`Foto in voller Größe öffnen: ${first.alt}`} className={OPEN}>
          <SiteImage image={first} sizes={MAIN_SIZES} className="object-cover" />
        </button>
        {first.caption && <figcaption className="pointer-events-none absolute bottom-4 left-4 max-w-[80%] truncate rounded-full bg-ink/60 px-3.5 py-1.5 text-sm leading-4.5 font-semibold text-mist backdrop-blur-sm max-sm:hidden">{first.caption}</figcaption>}
      </figure>
      {thumbs.map((photo, index) => {
        const isLast = index === thumbs.length - 1 && hidden > 0;
        const position = index + 1;
        return (
          <figure key={photo.src} className={`${TILE} ${thumbs.length === 1 ? "row-span-2 max-sm:row-span-1" : ""}`}>
            <button
              type="button"
              onClick={() => setViewerIndex(isLast ? position + 1 : position)}
              aria-label={isLast ? `Alle ${all.length} Fotos öffnen` : `Foto in voller Größe öffnen: ${photo.alt}`}
              className={OPEN}
            >
              <SiteImage image={photo} sizes={THUMB_SIZES} className="object-cover" />
              {/* Design: a dark overlay with white words in the middle, so it is clear there are more. */}
              {isLast && (
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-snow transition-colors hover:bg-black/70">
                  <TrailIcon name="grid" size={28} />
                  <span className="text-[28px] leading-none font-semibold">+{hidden} Fotos</span>
                  <span className="rounded-full border-[1.5px] border-solid border-white/80 px-4 py-1.5 text-[15px] leading-none font-semibold">Alle {all.length} ansehen</span>
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
