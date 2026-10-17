import type { RegionPhoto } from "../types";
import { RegionPhotoGrid } from "./RegionPhotoGrid";
import { RegionSectionHeading } from "./RegionSectionHeading";
import { WRAP } from "./styles";

type RegionPhotosProps = { regionName: string; photos: readonly RegionPhoto[] };

/** "See the valley": a photo mosaic that opens the full-screen viewer. */
export const RegionPhotos = ({ regionName, photos }: RegionPhotosProps) => {
  if (photos.length === 0) return null;

  return (
    <section id="photos" aria-labelledby="region-photos-title" className={`${WRAP} flex scroll-mt-14 flex-col gap-5.5 py-14`}>
      <RegionSectionHeading id="region-photos-title" kicker="Photos" title="See the valley" />
      <RegionPhotoGrid photos={photos} title={regionName} />
    </section>
  );
};
