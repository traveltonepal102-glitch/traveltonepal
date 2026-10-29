import { isFullWidthTrekSection } from "@ttn/config/trekPageSections";
import { Fragment } from "react";

import { JsonLd } from "@/components/shared/JsonLd";
import { getPublishedReviews } from "@/features/reviews/services/reviewsRepository";

import { defaultGroupIndex } from "../pricing";
import { trekPageReviews } from "../reviews";
import { fullWidthGroups, isBandSection } from "../sections";
import { trekBreadcrumbs, trekJsonLd } from "../seo";
import type { TrekDetail } from "../types";
import { BookingCard } from "./booking/BookingCard";
import { BookingSelectionProvider } from "./booking/BookingSelection";
import { TrekGallery } from "./gallery/TrekGallery";
import { MobileBookingBar } from "./MobileBookingBar";
import { trekSectionBlocks } from "./trekSectionBlocks";
import { TrekSectionNav } from "./TrekSectionNav";
import { TrekTitle } from "./TrekTitle";
import { TrekTopBar } from "./TrekTopBar";

/**
 * Trek page (design: Trek.dc.html). The provider shares the chosen group size and start day between
 * the booking card, the pricing section and both request forms. The sections follow the trek's own order
 * (beside the booking card, then the full-width ones); shared sections the trek hides are left out.
 */
export const TrekDetailPage = async ({ trek }: { trek: TrekDetail }) => {
  const published = await getPublishedReviews();
  const reviews = trek.hiddenSections.includes("reviews") ? [] : trekPageReviews(published, trek.slug);
  const blocks = trekSectionBlocks({ trek, reviews, rating: published.rating });
  const mainSections = trek.sectionOrder.filter((section) => !isFullWidthTrekSection(section));

  return (
    <>
      <JsonLd data={trekJsonLd(trek)} />
      <TrekTopBar breadcrumbs={trekBreadcrumbs(trek)} currentSeason={trek.currentSeason} />
      <TrekTitle trek={trek} />
      <TrekSectionNav hasReviews={reviews.length > 0} order={trek.sectionOrder} />

      <BookingSelectionProvider defaultGroupIndex={defaultGroupIndex(trek.groupPrices)} monthRatings={trek.monthRatings}>
        <div className="mx-auto grid max-w-content gap-8 px-4 pt-8 pb-12 md:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
          <div className="flex min-w-0 flex-col gap-6">
            <TrekGallery photos={trek.photos} badges={trek.photoBadges} title={trek.name} />
            {mainSections.map((section) => (
              <Fragment key={section}>{blocks[section]}</Fragment>
            ))}
          </div>
          <BookingCard trek={trek} />
        </div>

        {fullWidthGroups(trek.sectionOrder).map((group) =>
          isBandSection(group[0]) ? (
            <div key={group.join()} className="border-t border-line bg-surface py-12">
              <div className="mx-auto flex max-w-content flex-col gap-10 px-4 md:px-6">
                {group.map((section) => (
                  <Fragment key={section}>{blocks[section]}</Fragment>
                ))}
              </div>
            </div>
          ) : (
            <Fragment key={group.join()}>{blocks[group[0]]}</Fragment>
          ),
        )}
      </BookingSelectionProvider>

      <MobileBookingBar trek={trek} />
    </>
  );
};
