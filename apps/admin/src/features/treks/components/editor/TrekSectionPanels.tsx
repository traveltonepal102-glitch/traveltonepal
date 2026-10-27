"use client";

import { flushSync } from "react-dom";

import { useEditorSectionLinks } from "@/components/editor/EditorSectionLinks";
import { CoverAndGallery } from "@/features/photos/components/CoverAndGallery";
import type { GuideOption } from "@/features/trekking-guides/lib/guideOptions";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { TREK_LIMITS as LIMIT } from "../../constants";
import { dayAltitudesId, toDayAltitude, useItineraryDays } from "../../hooks/useItineraryDays";
import type { RegionOption, SimilarTrekOption, TrekPhotos, TrekSectionKey, TrekValues } from "../../types";
import { TrekFaqSection } from "./faq/TrekFaqSection";
import { TrekGuidesSection } from "./guides/TrekGuidesSection";
import { TrekItinerarySection } from "./itinerary/TrekItinerarySection";
import { KnowSection } from "./know/KnowSection";
import { FitSection } from "./overview/FitSection";
import { HighlightsSection } from "./overview/HighlightsSection";
import { IntroductionSection } from "./overview/IntroductionSection";
import { PageHeadingFields } from "./PageHeadingFields";
import { VideosCard } from "./photos/VideosCard";
import { PhotoBadgesCard } from "./PhotoBadgesCard";
import { PackingListCard } from "./practical/PackingListCard";
import { GroupPricesCard } from "./prices/GroupPricesCard";
import { StartDateCard } from "./prices/StartDateCard";
import { ElevationCard } from "./route/ElevationCard";
import { RouteMapCard } from "./route/RouteMapCard";
import { GoogleSearchCard } from "./seo/GoogleSearchCard";
import { SimilarTreksCard } from "./seo/SimilarTreksCard";
import { SharedSectionsCard } from "./SharedSectionsCard";
import { LinesAboveHeadingCard } from "./top/LinesAboveHeadingCard";
import { LinesUnderHeadingCard } from "./top/LinesUnderHeadingCard";
import { TrekDifficultyCard } from "./TrekDifficultyCard";
import { TrekFactsCard } from "./TrekFactsCard";
import { TrekIncludedSection } from "./TrekIncludedSection";
import { TrekListingCard } from "./TrekListingCard";
import { TrekNameCard } from "./TrekNameCard";

type TrekSectionPanelsProps = {
  activeKey: TrekSectionKey;
  values: TrekValues;
  photos: TrekPhotos;
  errors: FieldErrors;
  onEdit: () => void;
  regions: RegionOption[];
  similarOptions: SimilarTrekOption[];
  guideOptions: GuideOption[];
  regionId: string | null;
  isNew: boolean;
  pdfMapUrl: string | null;
};

/**
 * Every section of the trek editor, in the page's order. All stay in the form (the closed ones hidden), so Save
 * sends every field whichever section is open.
 */
export const TrekSectionPanels = ({ activeKey, values, photos, errors, onEdit, regions, similarOptions, guideOptions, regionId, isNew, pdfMapUrl }: TrekSectionPanelsProps) => {
  const photosError = Object.entries(errors).find(([field]) => field.startsWith("photos"))?.[1];
  const trekPhotos = [...(photos.cover ? [photos.cover] : []), ...photos.gallery];
  const panel = (key: TrekSectionKey) => ({ hidden: activeKey !== key, className: "flex flex-col gap-4" });
  // The days live here, so the altitude chart (Route) follows them as they are typed and can open one.
  const plan = useItineraryDays(values.itinerary, onEdit);
  const links = useEditorSectionLinks();
  const openDay = (index: number) => {
    const day = plan.days[index];
    if (!day) return;
    flushSync(() => plan.open(day.key));
    links?.show("itinerary", dayAltitudesId(day.key));
  };

  return (
    <>
      <div {...panel("top")}>
        <TrekNameCard values={values} errors={errors} regions={regions} isNew={isNew} />
        <LinesAboveHeadingCard values={values} errors={errors} />
        <LinesUnderHeadingCard values={values} errors={errors} />
        <TrekDifficultyCard values={values} errors={errors} />
        <PhotoBadgesCard badges={values.photoBadges} errors={errors} onEdit={onEdit} />
        <TrekListingCard values={values} errors={errors} />
      </div>
      <div {...panel("photos")}>
        <CoverAndGallery initial={photos} regionId={regionId} subject={values.name || "This trek"} onEdit={onEdit} error={photosError} />
        <VideosCard videos={values.videos} errors={errors} onEdit={onEdit} />
      </div>
      <div {...panel("intro")}>
        <IntroductionSection values={values} errors={errors} onEdit={onEdit} />
      </div>
      <div {...panel("facts")}>
        <TrekFactsCard values={values} errors={errors} />
      </div>
      <div {...panel("highlights")}>
        <HighlightsSection values={values} errors={errors} onEdit={onEdit} />
      </div>
      <div {...panel("fit")}>
        <FitSection values={values} errors={errors} onEdit={onEdit} />
      </div>
      <div {...panel("itinerary")}>
        <TrekItinerarySection values={values} plan={plan} errors={errors} photoChoices={trekPhotos} onEdit={onEdit} />
      </div>
      <div {...panel("inclusions")}>
        <PageHeadingFields
          eyebrow="Full disclosure"
          level="H2"
          heading={{ name: "inclusionsHeading", defaultValue: values.inclusionsHeading, placeholder: "What’s covered · What’s not included", error: errors.inclusionsHeading }}
        />
        <TrekIncludedSection values={values} errors={errors} onEdit={onEdit} />
      </div>
      <div {...panel("guides")}>
        <PageHeadingFields
          eyebrow="Local expertise and safety first"
          level="H3"
          heading={{ name: "guidesHeading", defaultValue: values.guidesHeading, placeholder: "Meet your trek guide", error: errors.guidesHeading }}
          line={{
            name: "guidesIntro",
            defaultValue: values.guidesIntro,
            placeholder: "Hand-picked, licensed guides born in the valley, trained in wilderness first aid and focused on your safety.",
            maxLength: LIMIT.guidesIntro,
            error: errors.guidesIntro,
          }}
        />
        <TrekGuidesSection
          guideIds={values.guideIds}
          options={guideOptions}
          regionId={values.regionId}
          regionName={regions.find((region) => region.id === values.regionId)?.name ?? ""}
          errors={errors}
          onEdit={onEdit}
        />
      </div>
      <div {...panel("route")}>
        <ElevationCard
          values={values}
          days={plan.days.map(toDayAltitude)}
          errors={errors}
          onSelectDay={openDay}
          onEditDays={() => links?.show("itinerary")}
        />
        <RouteMapCard values={values} pdfMapUrl={pdfMapUrl} errors={errors} onEdit={onEdit} />
      </div>
      <div {...panel("pricing")}>
        <PageHeadingFields
          eyebrow="Transparent pricing structure"
          level="H2"
          heading={{ name: "pricingHeading", defaultValue: values.pricingHeading, placeholder: "Group rates by team size", error: errors.pricingHeading }}
          line={{ name: "pricingIntro", defaultValue: values.pricingIntro, placeholder: "Book directly with our Kathmandu team, with no middlemen.", maxLength: LIMIT.pricingIntro, error: errors.pricingIntro }}
        />
        <GroupPricesCard prices={values.groupPrices} errors={errors} onEdit={onEdit} />
        <StartDateCard region={regions.find((region) => region.id === values.regionId)} />
      </div>
      <div {...panel("packing")}>
        <PageHeadingFields
          eyebrow="Gear and essentials"
          level="H2"
          heading={{ name: "packingHeading", defaultValue: values.packingHeading, placeholder: "Langtang Trek packing list", error: errors.packingHeading }}
          line={{ name: "packingIntro", defaultValue: values.packingIntro, placeholder: "Tested gear for the valley: −10 °C nights to 25 °C days in the forest.", maxLength: LIMIT.packingIntro, error: errors.packingIntro }}
        />
        <PackingListCard groups={values.packingGroups} errors={errors} onEdit={onEdit} />
      </div>
      <div {...panel("know")}>
        <KnowSection values={values} photos={trekPhotos} errors={errors} onEdit={onEdit} />
      </div>
      <div {...panel("faq")}>
        <PageHeadingFields
          level="H2"
          heading={{ name: "faqHeading", defaultValue: values.faqHeading, placeholder: "Frequently asked questions for the Langtang Valley Trek", error: errors.faqHeading }}
        />
        <TrekFaqSection faqs={values.faqs} errors={errors} onEdit={onEdit} />
      </div>
      <div {...panel("similar")}>
        <PageHeadingFields
          eyebrow="Explore more of the Himalaya"
          level="H2"
          heading={{ name: "similarHeading", defaultValue: values.similarHeading, placeholder: "Similar trekking options in Nepal", error: errors.similarHeading }}
          line={{ name: "similarIntro", defaultValue: values.similarIntro, placeholder: "Treks planned with you and led by local guides.", maxLength: LIMIT.similarIntro, error: errors.similarIntro }}
        />
        <SimilarTreksCard similarTrekIds={values.similarTrekIds} options={similarOptions} error={errors.similarTrekIds} onEdit={onEdit} />
      </div>
      <div {...panel("seo")}>
        <GoogleSearchCard values={values} errors={errors} />
      </div>
      <div {...panel("shared")}>
        <SharedSectionsCard hiddenSharedSections={values.hiddenSharedSections} />
      </div>
    </>
  );
};
