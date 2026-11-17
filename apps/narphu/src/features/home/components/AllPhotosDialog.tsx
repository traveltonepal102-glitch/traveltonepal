"use client";

import type { SiteImageSource } from "@ttn/site-data/images";
import { useRef, useState } from "react";

import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";

type AllPhotosDialogProps = {
  photos: readonly SiteImageSource[];
  /** How many the gallery doesn't show: the overlay says "+N photos". */
  hidden: number;
};

/**
 * Over the gallery's last photo (design: a dark overlay with white words in the middle, so it is clear there are more):
 * opens every photo in a window, their files loaded only once it is opened.
 */
export const AllPhotosDialog = ({ photos, hidden }: AllPhotosDialogProps) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const [wasOpened, setWasOpened] = useState(false);

  const open = () => {
    setWasOpened(true);
    dialog.current?.showModal();
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-label={`Open all ${photos.length} photos`}
        className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-2 border-0 bg-black/60 p-0 font-[inherit] text-snow transition-colors hover:bg-black/70"
      >
        <TrailIcon name="grid" size={28} />
        {hidden > 0 && <span className="text-[28px] leading-none font-semibold">+{hidden} photos</span>}
        <span className="rounded-full border-[1.5px] border-solid border-white/80 px-4 py-1.5 text-[15px] leading-none font-semibold">View all {photos.length}</span>
      </button>
      <dialog ref={dialog} aria-label="All photos" className="m-auto max-h-[90vh] w-[min(1100px,calc(100vw-32px))] rounded-3xl border-0 p-0 backdrop:bg-ink/80">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-snow px-5 py-3">
          <span className="font-semibold text-ink">{photos.length} photos</span>
          <button type="button" onClick={() => dialog.current?.close()} aria-label="Close the photos" className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border-0 bg-maroon-tint text-maroon">
            <TrailIcon name="close" />
          </button>
        </div>
        {wasOpened && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2 px-5 pb-5">
            {photos.map((photo) => (
              <figure key={photo.src} className="m-0 flex flex-col gap-1.5">
                <span className="relative block aspect-4/3 overflow-hidden rounded-xl bg-maroon-tint">
                  <SiteImage image={photo} sizes="(min-width: 768px) 360px, 100vw" className="object-cover" />
                </span>
                {photo.caption && <figcaption className="text-sm leading-5 text-muted">{photo.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}
      </dialog>
    </>
  );
};
