"use client";

import type { SiteImageSource } from "@ttn/site-data/images";
import { useRef, useState } from "react";

import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";

/** "All photos" over the gallery: every photo in a window, its files loaded only once it is opened. */
export const AllPhotosDialog = ({ photos }: { photos: readonly SiteImageSource[] }) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const [wasOpened, setWasOpened] = useState(false);

  const open = () => {
    setWasOpened(true);
    dialog.current?.showModal();
  };

  return (
    <>
      <button type="button" onClick={open} className="absolute right-4 bottom-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[10px] border-0 bg-snow px-4 text-[15px] font-semibold text-ink shadow-card">
        <TrailIcon name="grid" />
        All photos
      </button>
      <dialog ref={dialog} aria-label="All photos" className="m-auto max-h-[90vh] w-[min(1100px,calc(100vw-32px))] rounded-2xl border-0 p-0 backdrop:bg-forest-deep/80">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-snow px-5 py-3">
          <span className="font-semibold text-ink">{photos.length} photos</span>
          <button type="button" onClick={() => dialog.current?.close()} aria-label="Close the photos" className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full border-0 bg-forest-tint text-forest">
            <TrailIcon name="close" />
          </button>
        </div>
        {wasOpened && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-2 px-5 pb-5">
            {photos.map((photo) => (
              <div key={photo.src} className="relative aspect-4/3 overflow-hidden rounded-[10px] bg-forest-tint">
                <SiteImage image={photo} sizes="(min-width: 768px) 360px, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}
      </dialog>
    </>
  );
};
