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

/** The top of a trek page (design: the words beside the photos): breadcrumb, title and buttons on the left, the gallery on the right; one under the other on a phone. */
export const TrekTop = ({ breadcrumbs, top, trek, rating, hasReviews }: TrekTopProps) => (
  <section aria-label="Top of the page" className="wrap flex flex-wrap items-center gap-x-12 gap-y-8 pt-6 pb-10 max-md:pb-8">
    <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-5">
      {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
      <HomeTitle top={top} trek={trek} rating={rating} hasReviews={hasReviews} />
    </div>
    <div className="min-w-0 flex-[1_1_520px]">
      <HomeGallery main={top.photo} photos={trek?.photos ?? []} />
    </div>
  </section>
);
