"use client";

import type { SiteImageSource } from "@ttn/site-data/images";
import { useEffect, useRef } from "react";

import { SiteImage } from "@/components/ui/SiteImage";

type ViewerThumbnailsProps = {
  photos: readonly SiteImageSource[];
  currentIndex: number;
  onSelect: (index: number) => void;
};

/** Strip of thumbnails under the viewer; the current one is outlined and kept in view. */
export const ViewerThumbnails = ({ photos, currentIndex, onSelect }: ViewerThumbnailsProps) => {
  const stripRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const current = stripRef.current?.children[currentIndex];
    current?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [currentIndex]);

  return (
    <ul
      ref={stripRef}
      className="relative m-0 flex flex-none list-none snap-x snap-proximity gap-1.5 overflow-x-auto px-3 pt-2 pb-4.5 [scrollbar-width:none] md:justify-center-safe md:gap-2 md:px-4 md:pt-2.5 [&::-webkit-scrollbar]:hidden"
    >
      {photos.map((photo, index) => {
        const isCurrent = index === currentIndex;
        return (
          <li key={photo.src} className="flex-none snap-center">
            <button
              type="button"
              onClick={() => onSelect(index)}
              aria-label={`Foto ${index + 1} zeigen: ${photo.alt}`}
              aria-current={isCurrent || undefined}
              className={`relative block h-10.5 w-14 cursor-pointer overflow-hidden rounded-md border-solid bg-white/10 p-0 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-snow md:h-13 md:w-18 ${
                isCurrent ? "scale-108 border-3 border-glacier opacity-100" : "border-2 border-transparent opacity-45 hover:opacity-80"
              }`}
            >
              <SiteImage image={{ ...photo, alt: "" }} sizes="72px" className="object-cover" />
            </button>
          </li>
        );
      })}
    </ul>
  );
};
