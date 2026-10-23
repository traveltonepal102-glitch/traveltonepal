"use client";

import { EditorHeader } from "@/components/editor/EditorHeader";
import { EditorSectionNav } from "@/components/editor/EditorSectionNav";
import type { EditorSaveAction } from "@/components/editor/types";
import { useEditorForm } from "@/components/editor/useEditorForm";
import { FormAlert } from "@/components/ui/FormAlert";
import { CoverAndGallery } from "@/features/photos/components/CoverAndGallery";
import type { GuideOption } from "@/features/trekking-guides/lib/guideOptions";

import { TREKS_PATH } from "../../constants";
import { getTrekReadiness } from "../../lib/readiness";
import { TREK_SECTIONS, firstSectionWithError, sectionsWithErrors } from "../../sections";
import type { RegionOption, SimilarTrekOption, TrekPhotos, TrekSectionKey, TrekValues } from "../../types";
import { PhotoBadgesCard } from "./PhotoBadgesCard";
import { SharedSectionsCard } from "./SharedSectionsCard";
import { TrekDifficultyCard } from "./TrekDifficultyCard";
import { TrekFactsCard } from "./TrekFactsCard";
import { TrekIncludedSection } from "./TrekIncludedSection";
import { TrekListingCard } from "./TrekListingCard";
import { TrekNameCard } from "./TrekNameCard";
import { TrekFaqSection } from "./faq/TrekFaqSection";
import { TrekGuidesSection } from "./guides/TrekGuidesSection";
import { GoogleSearchCard } from "./seo/GoogleSearchCard";
import { SimilarTreksCard } from "./seo/SimilarTreksCard";
import { TrekItinerarySection } from "./itinerary/TrekItinerarySection";
import { PackingListCard } from "./practical/PackingListCard";
import { RouteMapCard } from "./practical/RouteMapCard";
import { DeparturesCard } from "./prices/DeparturesCard";
import { GroupPricesCard } from "./prices/GroupPricesCard";
import { TrekOverviewSection } from "./TrekOverviewSection";
import { TrekStatusSelect } from "./TrekStatusSelect";

type TrekEditorProps = {
  /** saveTrek bound to this trek's id (null for a new trek). */
  action: EditorSaveAction;
  values: TrekValues;
  photos: TrekPhotos;
  regions: RegionOption[];
  /** Every other trek, to pick similar treks from. */
  similarOptions: SimilarTrekOption[];
  /** Every trekking guide, to pick the trek's guides from. */
  guideOptions: GuideOption[];
  /** The region's id, to tag new uploads (null when the trek has none yet). */
  regionId: string | null;
  isNew: boolean;
  /** "YYYY-MM-DD" in Nepal (from the server), to tell past departure dates. */
  today: string;
  lastSaved?: string;
  isJustAdded?: boolean;
};

/**
 * Add or edit a trek (design: Admin-trek-editor). All sections are one form: switching sections keeps what
 * you typed, and Save sends everything, including the status. Nothing is saved until Save.
 */
export const TrekEditor = ({ action, values, photos, regions, similarOptions, guideOptions, regionId, isNew, today, lastSaved, isJustAdded = false }: TrekEditorProps) => {
  const form = useEditorForm<TrekSectionKey>({
    action,
    firstKey: "basics",
    firstSectionWithError,
    isNew,
    lastSaved,
    addedLabel: isJustAdded ? "Trek added" : undefined,
  });
  const { errors, activeKey, markDirty } = form;
  const [status, statusTone] = form.saveStatus;
  const photosError = Object.entries(errors).find(([field]) => field.startsWith("photos"))?.[1];
  const active = TREK_SECTIONS.find((section) => section.key === activeKey) ?? TREK_SECTIONS[0];

  return (
    <form noValidate onSubmit={form.handleSubmit} onChange={markDirty} className="flex flex-col gap-5">
      <EditorHeader
        back={{ href: TREKS_PATH, label: "Treks" }}
        title={isNew ? "New trek" : values.name}
        status={status}
        statusTone={statusTone}
        saveLabel={isNew ? "Add trek" : "Save changes"}
        isSaving={form.isSaving}
      >
        <TrekStatusSelect defaultValue={values.status} />
      </EditorHeader>
      {form.state.status === "error" && <FormAlert message={form.state.message} />}

      <div className="grid items-start gap-6 desktop:grid-cols-[260px_minmax(0,1fr)]">
        <EditorSectionNav
          label="Trek sections"
          progressTitle="Ready to publish"
          sections={TREK_SECTIONS}
          activeKey={activeKey}
          onSelect={form.setActiveKey}
          readiness={getTrekReadiness(values, photos, today)}
          errorKeys={sectionsWithErrors(Object.keys(errors))}
        />

        <div className="flex min-w-0 flex-col gap-4">
          <div>
            <h2 className="m-0 font-display text-[26px] leading-tight font-extrabold text-ink max-tablet:text-[22px]">{active.label}</h2>
            <p className="m-0 max-w-170 text-muted-foreground">{active.description}</p>
          </div>

          <div hidden={activeKey !== "basics"} className="flex flex-col gap-4">
            <TrekNameCard values={values} errors={errors} regions={regions} isNew={isNew} />
            <TrekDifficultyCard values={values} errors={errors} />
            <TrekFactsCard values={values} errors={errors} />
            <PhotoBadgesCard badges={values.photoBadges} errors={errors} onEdit={markDirty} />
            <TrekListingCard values={values} errors={errors} />
          </div>
          <div hidden={activeKey !== "photos"} className="flex flex-col gap-4">
            <CoverAndGallery
              initial={photos}
              regionId={regionId}
              subject={values.name || "This trek"}
              onEdit={markDirty}
              error={photosError}
            />
          </div>
          <div hidden={activeKey !== "overview"} className="flex flex-col gap-4">
            <TrekOverviewSection values={values} errors={errors} onEdit={markDirty} />
          </div>
          <div hidden={activeKey !== "itinerary"} className="flex flex-col gap-4">
            <TrekItinerarySection
              values={values}
              errors={errors}
              photoChoices={[...(photos.cover ? [photos.cover] : []), ...photos.gallery]}
              onEdit={markDirty}
            />
          </div>
          <div hidden={activeKey !== "prices"} className="flex flex-col gap-4">
            <GroupPricesCard prices={values.groupPrices} errors={errors} onEdit={markDirty} />
            <DeparturesCard hasFixedDates={values.hasFixedDates} departures={values.departures} today={today} errors={errors} onEdit={markDirty} />
          </div>
          <div hidden={activeKey !== "included"} className="flex flex-col gap-4">
            <TrekIncludedSection values={values} errors={errors} onEdit={markDirty} />
          </div>
          <div hidden={activeKey !== "practical"} className="flex flex-col gap-4">
            <RouteMapCard values={values} errors={errors} />
            <PackingListCard intro={values.packingIntro} groups={values.packingGroups} errors={errors} onEdit={markDirty} />
          </div>
          <div hidden={activeKey !== "faq"} className="flex flex-col gap-4">
            <TrekFaqSection faqs={values.faqs} errors={errors} onEdit={markDirty} />
          </div>
          <div hidden={activeKey !== "seo"} className="flex flex-col gap-4">
            <GoogleSearchCard values={values} errors={errors} />
            <SimilarTreksCard similarTrekIds={values.similarTrekIds} options={similarOptions} error={errors.similarTrekIds} onEdit={markDirty} />
          </div>
          <div hidden={activeKey !== "guides"} className="flex flex-col gap-4">
            <TrekGuidesSection
              intro={values.guidesIntro}
              guideIds={values.guideIds}
              options={guideOptions}
              regionId={values.regionId}
              regionName={regions.find((region) => region.id === values.regionId)?.name ?? ""}
              errors={errors}
              onEdit={markDirty}
            />
          </div>
          <div hidden={activeKey !== "shared"} className="flex flex-col gap-4">
            <SharedSectionsCard hiddenSharedSections={values.hiddenSharedSections} />
          </div>
        </div>
      </div>
    </form>
  );
};
