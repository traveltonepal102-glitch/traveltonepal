"use client";

import type { SiteImageSource } from "@ttn/site-data/images";
import { useState } from "react";

import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";

import { PhotoViewer } from "./PhotoViewer";

type ExpandablePhotoProps = {
  photo: SiteImageSource;
  /** Shown in the viewer's top bar, e.g. "Day 3: Koto to Meta". */
  title: string;
  /** `sizes` of the photo on the page. */
  sizes: string;
  /** Size and shape of the photo on the page (it fills this box). */
  className: string;
};

/** A photo on the page that opens full size in the viewer, with an expand mark in its corner (as on Travel To Nepal). */
export const ExpandablePhoto = ({ photo, title, sizes, className }: ExpandablePhotoProps) => {
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => setViewerIndex(0)}
        aria-label={`Open photo full size: ${photo.alt}`}
        className={`group block cursor-zoom-in overflow-hidden border-0 p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${className}`}
      >
        {/* The image keeps its own text: Google Images reads it, not the button's label. */}
        <SiteImage image={photo} sizes={sizes} className="object-cover transition-transform duration-300 group-hover:scale-104" />
        <span aria-hidden="true" className="absolute right-2 bottom-2 inline-flex size-8 items-center justify-center rounded-full bg-ink/70 text-snow">
          <TrailIcon name="expand" size={16} />
        </span>
      </button>
      <PhotoViewer photos={[photo]} title={title} index={viewerIndex} onIndexChange={setViewerIndex} />
    </>
  );
};
