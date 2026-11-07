import type { SiteImageSource } from "@ttn/site-data/images";

import { SiteImage } from "@/components/ui/SiteImage";

import { AllPhotosDialog } from "./AllPhotosDialog";

/** The biggest the first photo shows beside the others, and alone (the page's whole width). */
const MAIN_SIZES = "(min-width: 1440px) 930px, (min-width: 768px) 65vw, 100vw";
const ALONE_SIZES = "(min-width: 1440px) 1392px, 100vw";
const THUMB_SIZES = "(min-width: 768px) 460px, 1px";

const layoutFor = (thumbs: number) => {
  if (thumbs === 0) return "grid-cols-1";
  if (thumbs < 4) return "md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]";
  return "md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]";
};

/** The chosen photo large, with up to four of the trek's beside it (a phone shows only the large one), and "All photos". */
export const HomeGallery = ({ main, photos }: { main?: SiteImageSource; photos: readonly SiteImageSource[] }) => {
  const [first, ...rest] = main ? [main, ...photos.filter((photo) => photo.src !== main.src)] : photos;
  if (!first) return null;
  const count = rest.length >= 4 ? 4 : Math.min(rest.length, 2);
  const thumbs = rest.slice(0, count);
  const all = [first, ...rest];

  return (
    <div className={`relative grid h-70 grid-cols-1 gap-2 overflow-hidden rounded-2xl md:h-[448px] md:grid-rows-2 ${layoutFor(count)}`}>
      <div className="relative bg-forest-tint md:row-span-2">
        <SiteImage image={first} sizes={count === 0 ? ALONE_SIZES : MAIN_SIZES} isPriority className="object-cover" />
      </div>
      {thumbs.map((photo) => (
        <div key={photo.src} className={`relative hidden bg-forest-tint md:block ${count === 1 ? "md:row-span-2" : ""}`}>
          <SiteImage image={photo} sizes={THUMB_SIZES} className="object-cover" />
        </div>
      ))}
      {all.length > 1 && <AllPhotosDialog photos={all} />}
    </div>
  );
};
