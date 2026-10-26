import { SiteImage } from "@/components/ui/SiteImage";
import type { SiteImageSource } from "@/lib/images";

const TILE = "relative overflow-hidden rounded-2xl";
const SIZES = "(min-width: 1024px) 280px, 50vw";

/** Until photos are picked in Pages › About: a village, the Kyanjin chorten and trekkers on the trail. */
const DEFAULT_PHOTOS: readonly SiteImageSource[] = [
  { src: "/images/tamang-heritage-village.jpg", alt: "Terraced Tamang village on the hillside" },
  { src: "/images/kyanjin-gompa-chorten.jpg", alt: "Stone chorten above Kyanjin Gompa" },
  { src: "/images/trekkers-on-trail.jpg", alt: "Trekkers on a mountain trail in Nepal" },
];

/** Three-photo collage beside the story, the first one tall; fewer picked photos are topped up with the defaults. */
export const StoryPhotos = ({ photos }: { photos: readonly SiteImageSource[] }) => {
  const [tall, ...rest] = [...photos, ...DEFAULT_PHOTOS.slice(photos.length)].slice(0, 3);
  return (
    <div className="grid grid-cols-2 grid-rows-[180px_180px] gap-3 sm:grid-rows-[220px_220px]">
      <div className={`${TILE} row-span-2`}>
        <SiteImage image={tall} sizes={SIZES} className="object-cover" />
      </div>
      {rest.map((photo) => (
        <div key={photo.src} className={TILE}>
          <SiteImage image={photo} sizes={SIZES} className="object-cover" />
        </div>
      ))}
    </div>
  );
};
