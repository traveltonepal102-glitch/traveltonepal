"use client";

import { Icon } from "@ttn/ui/icon";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { SiteImage } from "@/components/ui/SiteImage";

import type { ViewerPhoto } from "./types";
import { ViewerThumbnails } from "./ViewerThumbnails";

type PhotoViewerProps = {
  photos: readonly ViewerPhoto[];
  /** Shown beside the counter, e.g. the trek or region name. */
  title: string;
  /** The photo on screen, or null while the viewer is closed. */
  index: number | null;
  onIndexChange: (index: number | null) => void;
};

const ROUND_BUTTON =
  "inline-flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/18 bg-white/10 text-white hover:bg-white/22 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const ARROW = `${ROUND_BUTTON} absolute top-1/2 z-2 size-10.5 -translate-y-1/2 max-md:bg-black/45 md:size-13`;

/**
 * Full-screen photo viewer, the same on every page with photos. A native modal <dialog> gives Esc to
 * close, a focus trap and focus back to the opening button; arrow keys move between photos.
 */
export const PhotoViewer = ({ photos, title, index, onIndexChange }: PhotoViewerProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  /** Which photo is zoomed in, so moving to another photo resets the zoom. */
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const count = photos.length;
  const isOpen = index !== null && count > 0;
  const current = isOpen ? ((index % count) + count) % count : 0;
  const photo = photos[current];
  const isZoomed = isOpen && zoomedIndex === current;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
    if (!isOpen) return;
    // The page behind should not scroll while the viewer covers it.
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const show = (next: number) => onIndexChange((next + count) % count);
  const toggleZoom = () => setZoomedIndex(isZoomed ? null : current);

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
      className="m-0 h-dvh max-h-none w-dvw max-w-none bg-[#0a1016] p-0 text-white backdrop:bg-black/80"
    >
      {isOpen && photo && (
        <div className="flex h-full flex-col">
          <div className="flex flex-none items-center justify-between gap-3 px-4 py-3.5">
            <p className="inline-flex min-w-0 items-center gap-2.5 text-body-sm font-bold text-line">
              <span aria-live="polite" className="flex-none rounded-full bg-white/12 px-2.5 py-1">
                {current + 1} / {count}
              </span>
              <span className="truncate font-semibold text-subtle">{title}</span>
            </p>
            <div className="flex flex-none gap-2">
              <button type="button" onClick={toggleZoom} aria-label={isZoomed ? "Zoom out" : "Zoom in"} className={ROUND_BUTTON}>
                <Icon name={isZoomed ? "zoom_out" : "zoom_in"} size={22} />
              </button>
              <button type="button" onClick={() => onIndexChange(null)} aria-label="Close photos" title="Close (Esc)" className={ROUND_BUTTON}>
                <Icon name="close" size={22} />
              </button>
            </div>
          </div>

          <div className="relative min-h-0 flex-1 overflow-hidden md:px-22">
            <div className="relative h-full w-full">
              <SiteImage
                key={photo.src}
                image={photo}
                sizes="100vw"
                onClick={toggleZoom}
                className={`rounded-md object-contain transition-transform duration-250 select-none ${isZoomed ? "scale-180 cursor-zoom-out" : "cursor-zoom-in"}`}
              />
            </div>
            {count > 1 && (
              <>
                <button type="button" onClick={() => show(current - 1)} aria-label="Previous photo" className={`${ARROW} left-4`}>
                  <Icon name="arrow_back" size={24} />
                </button>
                <button type="button" onClick={() => show(current + 1)} aria-label="Next photo" className={`${ARROW} right-4`}>
                  <Icon name="arrow_forward" size={24} />
                </button>
              </>
            )}
          </div>

          <div className="flex flex-none flex-col gap-0.5 px-4 pt-3 pb-1 text-center">
            <p className="text-[15px] font-bold text-white">{photo.alt}</p>
            {photo.caption && <p className="text-caption font-normal text-subtle">{photo.caption}</p>}
          </div>
          {count > 1 && <ViewerThumbnails photos={photos} currentIndex={current} onSelect={show} />}
        </div>
      )}
    </dialog>
  );
};
