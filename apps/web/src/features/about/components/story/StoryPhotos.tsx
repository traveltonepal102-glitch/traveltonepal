import { Icon } from "@ttn/ui/icon";
import Image from "next/image";

const TILE = "relative overflow-hidden rounded-2xl";

/** Three-photo collage beside the story: a tall village photo, the Kyanjin chorten and the team (placeholder until the photo exists). */
export const StoryPhotos = () => (
  <div className="grid grid-cols-2 grid-rows-[180px_180px] gap-3 sm:grid-rows-[220px_220px]">
    <div className={`${TILE} row-span-2`}>
      <Image
        src="/images/tamang-heritage-village.jpg"
        alt="Terraced Tamang village on the hillside"
        fill
        sizes="(min-width: 1024px) 280px, 50vw"
        className="object-cover"
      />
    </div>
    <div className={TILE}>
      <Image src="/images/kyanjin-gompa-chorten.jpg" alt="Stone chorten above Kyanjin Gompa" fill sizes="(min-width: 1024px) 280px, 50vw" className="object-cover" />
    </div>
    {/* TODO(owner): a real photo of the team at the office replaces this placeholder. */}
    <div className={`${TILE} flex items-center justify-center bg-linear-160 from-[#d3e3f1] to-chart-3 text-navy/40`}>
      <Icon name="groups" size={64} />
      <span className="absolute bottom-2.5 left-3 text-[11px] font-bold text-navy">[Team photo at the office]</span>
    </div>
  </div>
);
