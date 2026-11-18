"use client";

import type { SiteImageSource } from "@ttn/site-data/images";
import { useEffect, useRef } from "react";
import type { KeyboardEvent } from "react";

import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";

import { usePhotoZoom } from "./usePhotoZoom";
import { ViewerThumbnails } from "./ViewerThumbnails";

type PhotoViewerProps = {
  photos: readonly SiteImageSource[];
  /** Shown beside the counter, e.g. the trek's name or "Day 3: Samagaon to Samdo". */
  title: string;
  /** The photo on screen, or null while the viewer is closed. */
  index: number | null;
  onIndexChange: (index: number | null) => void;
};

const ROUND_BUTTON =
  "inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-solid border-white/18 bg-white/10 p-0 text-snow hover:bg-white/22 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-snow";
const ARROW = `${ROUND_BUTTON} absolute top-1/2 z-2 -translate-y-1/2 max-md:bg-black/45 md:size-13`;

/**
 * Full-screen photo viewer, one photo at a time (as on Travel To Nepal): arrows, the keyboard's arrow keys and the
 * thumbnails move between photos, a click zooms in, Esc closes. A native modal <dialog> traps the focus and gives it
 * back to the button that opened it. The photo's caption from the admin shows under it.
 */
export const PhotoViewer = ({ photos, title, index, onIndexChange }: PhotoViewerProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const count = photos.length;
  const isOpen = index !== null && count > 0;
  const current = isOpen ? ((index % count) + count) % count : 0;
  const photo = photos[current];
  const zoom = usePhotoZoom(current);
  const isZoomed = isOpen && zoom.isZoomed;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
    // The page behind doesn't scroll while it is open: the `html:has(dialog:modal)` rule in globals.css.
  }, [isOpen]);

  const show = (next: number) => onIndexChange((next + count) % count);

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowLeft") show(current - 1);
    if (event.key === "ArrowRight") show(current + 1);
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={() => onIndexChange(null)}
      onKeyDown={handleKeyDown}
      aria-label={photo ? `Photo ${current + 1} of ${count}: ${photo.alt}` : title}
      className="m-0 h-dvh max-h-none w-dvw max-w-none border-0 bg-ink p-0 text-snow backdrop:bg-black/80"
    >
      {isOpen && photo && (
        <div className="flex h-full flex-col">
          <div className="flex flex-none items-center justify-between gap-3 px-4 py-3.5">
            <p className="inline-flex min-w-0 items-center gap-2.5 text-[15px] font-semibold">
              <span aria-live="polite" className="flex-none rounded-full bg-white/12 px-2.5 py-1">
                {current + 1} / {count}
              </span>
              <span className="truncate text-white/70">{title}</span>
            </p>
            <div className="flex flex-none gap-2">
              <button type="button" onClick={zoom.toggle} aria-label={isZoomed ? "Zoom out" : "Zoom in"} className={ROUND_BUTTON}>
                <TrailIcon name={isZoomed ? "zoom-out" : "zoom-in"} size={22} />
              </button>
              <button type="button" onClick={() => onIndexChange(null)} aria-label="Close photos" title="Close (Esc)" className={ROUND_BUTTON}>
                <TrailIcon name="close" size={22} />
              </button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden md:px-22">
            {/* A click zooms in where it lands and moving over the photo moves around it; keyboards use the zoom button above, so this one is skipped by Tab and screen readers. */}
            <button
              type="button"
              {...zoom.handlers}
              tabIndex={-1}
              aria-hidden="true"
              className={`relative block h-full w-full overflow-hidden border-0 bg-transparent p-0 ${isZoomed ? "cursor-zoom-out touch-none" : "cursor-zoom-in"}`}
            >
              <span style={{ transformOrigin: zoom.origin }} className={`absolute inset-0 transition-transform duration-250 ${isZoomed ? "scale-250" : ""}`}>
                {/* Zoomed, the browser loads a larger file so the photo stays sharp. */}
                <SiteImage key={photo.src} image={photo} sizes={isZoomed ? "250vw" : "100vw"} className="rounded-md object-contain select-none" />
              </span>
            </button>
            {count > 1 && (
              <>
                <button type="button" onClick={() => show(current - 1)} aria-label="Previous photo" className={`${ARROW} left-4`}>
                  <TrailIcon name="arrow" size={24} className="rotate-180" />
                </button>
                <button type="button" onClick={() => show(current + 1)} aria-label="Next photo" className={`${ARROW} right-4`}>
                  <TrailIcon name="arrow" size={24} />
                </button>
              </>
            )}
          </div>

          <div className="flex flex-none flex-col items-center gap-0.5 px-4 pt-3 pb-1 text-center">
            <p className="text-[15px] font-semibold text-snow">{photo.alt}</p>
            {photo.caption && <p className="text-sm text-white/70">{photo.caption}</p>}
          </div>
          {count > 1 && <ViewerThumbnails photos={photos} currentIndex={current} onSelect={show} />}
        </div>
      )}
    </dialog>
  );
};
