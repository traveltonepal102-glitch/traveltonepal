"use client";

import { Icon } from "@ttn/ui/icon";
import { useState } from "react";

import { SiteImage } from "@/components/ui/SiteImage";
import type { SiteImageSource } from "@/lib/images";

import { PhotoViewer } from "./PhotoViewer";

type ExpandablePhotoProps = {
  photo: SiteImageSource;
  /** Shown in the viewer's top bar, e.g. "Day 3: Drive from Besisahar to Chame". */
  title: string;
  /** `sizes` of the small photo. */
  sizes: string;
  /** Size and shape of the small photo (it fills this box). */
  className: string;
};

/** A small photo that opens the full-screen viewer on click, with an expand mark in its corner. */
export const ExpandablePhoto = ({ photo, title, sizes, className }: ExpandablePhotoProps) => {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => setViewerIndex(0)}
        aria-label={`Open photo full size: ${photo.alt}`}
        className={`group relative block cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${className}`}
      >
        {/* The image keeps its own text: Google Images reads it, not the button's label. */}
        <SiteImage image={photo} sizes={sizes} className="object-cover transition-transform duration-300 group-hover:scale-104" />
        <span aria-hidden="true" className="absolute right-1.5 bottom-1.5 inline-flex size-7 items-center justify-center rounded-full bg-ink/70 text-white">
          <Icon name="open_in_full" size={15} />
        </span>
      </button>
      <PhotoViewer photos={[photo]} title={title} index={viewerIndex} onIndexChange={setViewerIndex} />
    </>
  );
};
