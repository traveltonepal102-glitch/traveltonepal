import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

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
  <section aria-label="Top of the page" className="wrap flex flex-col gap-5 pt-7 pb-10 max-md:pb-8">
    {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
    <HomeTitle top={top} trek={trek} rating={rating} hasReviews={hasReviews} />
    <HomeGallery main={top.photo} photos={trek?.photos ?? []} />
  </section>
);
