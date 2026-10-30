"use client";

import { Icon } from "@ttn/ui/icon";
import { useState } from "react";

import { PhotoViewer } from "@/components/shared/photo-viewer/PhotoViewer";
import { SiteImage } from "@/components/ui/SiteImage";
import { formatAltitudeWithFeet } from "@/features/treks/format";

import type { TrekPhoto, TrekPhotoBadge } from "../../types";
import { GalleryThumbnails } from "./GalleryThumbnails";

type TrekGalleryProps = {
  photos: readonly TrekPhoto[];
  badges: readonly TrekPhotoBadge[];
  /** Title in the full-screen viewer, e.g. the trek name. */
  title: string;
};

const BADGE_TONES = {
  brand: { icon: "text-brand", text: "text-ink" },
  green: { icon: "text-whatsapp", text: "text-whatsapp" },
} as const;

const ARROW =
  "absolute top-1/2 -mt-5 inline-flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow-card hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";
const ON_PHOTO = "rounded-md border border-white/20 bg-ink/80";

/** "Kyanjin Gompa · 3,870 m / 12,697 ft", or just the place, or nothing. */
const photoCaption = ({ place, altitudeM }: TrekPhoto) => {
  if (!place) return undefined;
  return altitudeM ? `${place} · ${formatAltitudeWithFeet(altitudeM)}` : place;
};

/** Main photo with badges, arrows and thumbnails; the photo and "View full size" open the full-screen viewer. */
export const TrekGallery = ({ photos, badges, title }: TrekGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const photo = photos[activeIndex];
  if (!photo) return null;

  const count = photos.length;
  const showPhoto = (index: number) => setActiveIndex((index + count) % count);
  const caption = photoCaption(photo);

  return (
    <div className="flex flex-col gap-2.5">
      <figure className="relative aspect-4/3 overflow-hidden rounded-lg border border-line bg-line-strong shadow-[0_6px_16px_rgba(15,23,42,0.10)] md:aspect-16/10">
        {/* Clicking the photo is a mouse shortcut; "View full size" below is the accessible control. */}
        <SiteImage
          key={photo.src}
          image={photo}
          priority={activeIndex === 0}
          sizes="(min-width: 1240px) 790px, (min-width: 1024px) 64vw, 100vw"
          onClick={() => setViewerIndex(activeIndex)}
          className="cursor-zoom-in object-cover"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/60 to-transparent to-45%" />

        {/* Smaller on phones, so the badges stay above the arrows instead of stacking over the photo. */}
        <ul className="absolute inset-x-2.5 top-2.5 flex flex-wrap gap-1.5 sm:inset-x-3.5 sm:top-3.5 sm:gap-2">
          {badges.map((badge) => (
            <li
              key={badge.label}
              className={`inline-flex items-center gap-1 rounded-sm border border-line bg-white/95 px-1.5 py-0.5 text-[10px] font-bold tracking-[0.03em] uppercase shadow-card sm:gap-1.5 sm:px-2.5 sm:py-1 sm:text-[11px] sm:tracking-[0.06em] ${BADGE_TONES[badge.tone].text}`}
            >
              <Icon name={badge.icon} size={15} className={`max-sm:size-3.5 ${BADGE_TONES[badge.tone].icon}`} />
              {badge.label}
            </li>
          ))}
        </ul>

        {count > 1 && (
          <>
            <button type="button" aria-label="Previous photo" onClick={() => showPhoto(activeIndex - 1)} className={`${ARROW} left-3.5`}>
              <Icon name="arrow_back" />
            </button>
            <button type="button" aria-label="Next photo" onClick={() => showPhoto(activeIndex + 1)} className={`${ARROW} right-3.5`}>
              <Icon name="arrow_forward" />
            </button>
          </>
        )}

        <figcaption className="pointer-events-none absolute inset-x-3.5 bottom-3.5 flex items-end justify-between gap-2 text-white">
          {caption ? (
            <span aria-live="polite" className={`${ON_PHOTO} inline-flex min-w-0 items-center gap-1.5 px-3 py-1.5 text-xs font-semibold`}>
              <Icon name="location_on" size={16} className="flex-none text-saffron" />
              <span className="truncate">{caption}</span>
            </span>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={() => setViewerIndex(activeIndex)}
            className={`${ON_PHOTO} pointer-events-auto inline-flex flex-none cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
          >
            <Icon name="open_in_full" size={16} />
            {activeIndex + 1} / {count}
            <span className="max-sm:sr-only">{" "}· View full size</span>
          </button>
        </figcaption>
      </figure>

      {count > 1 && (
        <GalleryThumbnails photos={photos} activeIndex={activeIndex} onSelect={setActiveIndex} onShowAll={setViewerIndex} />
      )}

      <PhotoViewer
        photos={photos.map((item) => ({ ...item, caption: photoCaption(item) }))}
        title={title}
        index={viewerIndex}
        onIndexChange={setViewerIndex}
      />
    </div>
  );
};
