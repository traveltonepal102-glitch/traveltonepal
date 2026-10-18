import Image from "next/image";

import { TrekPhotoPlaceholder } from "@/features/treks/components/TrekPhotoPlaceholder";
import type { TrekSummary } from "@/features/treks/types";

/** The trek's photo filling its (relative) box, or drawn mountains while it has none. */
export const TrekPhoto = ({ trek, sizes }: { trek: TrekSummary; sizes: string }) =>
  trek.image ? (
    <Image src={trek.image.src} alt={trek.image.alt} fill sizes={sizes} className="object-cover" />
  ) : (
    <TrekPhotoPlaceholder />
  );
