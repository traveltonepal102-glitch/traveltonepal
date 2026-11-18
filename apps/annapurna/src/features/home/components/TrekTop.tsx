import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { SITE_NAME } from "@/lib/site";

import type { HomeRating, HomeTop, HomeTrek } from "../types";
import { HomeGallery } from "./HomeGallery";
import { HomeTitle } from "./HomeTitle";

type TrekTopProps = {
  breadcrumbs: readonly { label: string; href?: string }[];
  top: HomeTop;
  trek: HomeTrek | null;
  rating: HomeRating | null;
  hasReviews: boolean;
};

/** The top of a trek page, in the order Manaslu Trek's has: breadcrumb, the title across the page with its buttons, then the photos. */
export const TrekTop = ({ breadcrumbs, top, trek, rating, hasReviews }: TrekTopProps) => (
  <section aria-label="Seitenanfang" className="wrap flex flex-col gap-4 pt-5 pb-8 max-md:pb-6">
    {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
    <HomeTitle top={top} trek={trek} rating={rating} hasReviews={hasReviews} />
    <HomeGallery main={top.photo} photos={trek?.photos ?? []} title={trek?.name ?? SITE_NAME} />
  </section>
);
