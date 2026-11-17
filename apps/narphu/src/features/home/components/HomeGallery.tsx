import type { SiteImageSource } from "@ttn/site-data/images";

import { SiteImage } from "@/components/ui/SiteImage";

import { AllPhotosDialog } from "./AllPhotosDialog";

/** The first photo is the page's largest picture (LCP): about two thirds of the column beside the booking card. */
const MAIN_SIZES = "(min-width: 1024px) 560px, 66vw";
const THUMB_SIZES = "(min-width: 1024px) 280px, 33vw";
const TILE = "relative m-0 overflow-hidden rounded-[22px] bg-maroon-tint";

/**
 * The photo mosaic (design: one large photo and two beside it): the page's chosen photo first, then the trek's. The last
 * tile opens every photo, darkened with "+N photos" on it. Fills the height beside the booking card.
 */
export const HomeGallery = ({ main, photos }: { main?: SiteImageSource; photos: readonly SiteImageSource[] }) => {
  const all = main ? [main, ...photos.filter((photo) => photo.src !== main.src)] : [...photos];
  const [first, ...rest] = all;
  if (!first) return null;
  const thumbs = rest.slice(0, 2);
  const hidden = all.length - 1 - thumbs.length;

  return (
    <div className={`grid min-h-95 flex-1 gap-3 max-sm:min-h-0 ${thumbs.length ? "grid-cols-[minmax(0,2fr)_minmax(0,1fr)] grid-rows-2 max-sm:grid-cols-2 max-sm:grid-rows-[240px_150px]" : "grid-cols-1 max-sm:h-60"}`}>
      <figure className={`${TILE} ${thumbs.length ? "row-span-2 max-sm:col-span-2 max-sm:row-span-1" : ""}`}>
        <SiteImage image={first} sizes={MAIN_SIZES} isPriority className="object-cover" />
        {first.caption && <figcaption className="absolute bottom-4 left-4 max-w-[80%] truncate rounded-full bg-ink/60 px-3.5 py-1.5 text-sm leading-4.5 font-semibold text-paper backdrop-blur-sm max-sm:hidden">{first.caption}</figcaption>}
      </figure>
      {thumbs.map((photo, index) => (
        <figure key={photo.src} className={`${TILE} ${thumbs.length === 1 ? "row-span-2 max-sm:row-span-1" : ""}`}>
          <SiteImage image={photo} sizes={THUMB_SIZES} className="object-cover" />
          {index === thumbs.length - 1 && all.length > 1 && <AllPhotosDialog photos={all} hidden={hidden} />}
        </figure>
      ))}
    </div>
  );
};
