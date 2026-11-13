import type { SiteImageSource } from "@ttn/site-data/images";

import { SiteImage } from "@/components/ui/SiteImage";

import { AllPhotosDialog } from "./AllPhotosDialog";

/** The biggest the first photo shows: half the page beside the title, the whole width on a phone. */
const MAIN_SIZES = "(min-width: 1440px) 700px, (min-width: 768px) 50vw, 100vw";
const THUMB_SIZES = "(min-width: 768px) 170px, 1px";
const THUMB_COUNT = 4;

/** The chosen photo large (5:4, design), a row of up to four of the trek's under it (a phone shows only the large one), and "All photos". */
export const HomeGallery = ({ main, photos }: { main?: SiteImageSource; photos: readonly SiteImageSource[] }) => {
  const [first, ...rest] = main ? [main, ...photos.filter((photo) => photo.src !== main.src)] : photos;
  if (!first) return null;
  const thumbs = rest.slice(0, THUMB_COUNT);
  const all = [first, ...rest];

  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative aspect-5/4 overflow-hidden rounded-3xl bg-sky max-md:aspect-4/3">
        <SiteImage image={first} sizes={MAIN_SIZES} isPriority className="object-cover" />
        {all.length > 1 && <AllPhotosDialog photos={all} />}
      </div>
      {thumbs.length > 0 && (
        <ul className="grid grid-cols-4 gap-2.5 max-md:hidden" aria-label="More photos">
          {thumbs.map((photo) => (
            <li key={photo.src} className="relative aspect-4/3 overflow-hidden rounded-[14px] bg-sky">
              <SiteImage image={photo} sizes={THUMB_SIZES} className="object-cover" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
