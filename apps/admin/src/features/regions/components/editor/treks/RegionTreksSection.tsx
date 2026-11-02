"use client";

import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";
import { useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import { TREKS_PATH } from "@/features/treks/constants";
import type { SimilarTrekOption } from "@/features/treks/types";
import { useRowList } from "@/hooks/useRowList";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { REGION_LIMITS as LIMIT } from "../../../constants";
import type { MoreTrek, RegionValues } from "../../../types";
import { MoreTreksCard } from "./MoreTreksCard";
import { RegionTrekRow } from "./RegionTrekRow";

type RegionTreksSectionProps = {
  values: RegionValues;
  /** null for a new region. */
  regionId: string | null;
  regionName: string;
  /** The treks whose main region this is (A–Z), then the treks that pass through it (from the trek editor). */
  regionTreks: SimilarTrekOption[];
  errors: FieldErrors;
  onEdit: () => void;
};

/**
 * "Trek in …" on the region page (design: section "treks"): the region's own treks with one featured, any of the
 * others to show under it, and the "Want your own route?" line. The treks themselves are listed, not picked.
 */
export const RegionTreksSection = ({ values, regionId, regionName, regionTreks, errors, onEdit }: RegionTreksSectionProps) => {
  // A featured trek moved to another region since the last save no longer counts.
  const [featuredId, setFeaturedId] = useState(regionTreks.some((trek) => trek.id === values.featuredTrekId) ? values.featuredTrekId : null);
  // The treks ticked to show under it; one that left the region since the last save drops out here.
  const more = useRowList<MoreTrek>(
    values.moreTreks.filter((item) => item.trekId !== featuredId && regionTreks.some((trek) => trek.id === item.trekId)),
    onEdit,
  );
  const name = regionName.trim() || "this region";

  const rowOf = (trekId: string) => more.rows.find((row) => row.trekId === trekId);

  const handleFeature = (trekId: string) => {
    setFeaturedId(trekId);
    // The featured trek is shown once, at the top.
    const row = rowOf(trekId);
    if (row) more.remove(row.key);
    else onEdit();
  };

  const toggleShown = (trekId: string) => {
    const row = rowOf(trekId);
    if (row) more.remove(row.key);
    else more.add({ trekId, label: "", note: "" });
  };

  return (
    <>
      <FormSection
        title={`Treks in ${name}`}
        hint={`A trek joins this region when you add “${name}” to its regions on the route in the trek editor: first, or as a region it passes through. Pick the one to feature, and tick “Also show” on the ones to show under it.`}
        aside={
          <Link href={TREKS_PATH} className={cn(secondaryButton, "min-h-8 px-3 text-caption")}>
            Open Treks
          </Link>
        }
      >
        <input type="hidden" name="featuredTrekId" value={featuredId ?? ""} />
        {regionTreks.length ? (
          <ul aria-label={`Treks in ${name}`} className="m-0 flex list-none flex-col gap-2 p-0">
            {regionTreks.map((trek) => {
              const isShown = more.rows.some((row) => row.trekId === trek.id);
              return (
                <RegionTrekRow
                  key={trek.id}
                  trek={trek}
                  regionId={regionId}
                  isFeatured={trek.id === featuredId}
                  isShown={isShown}
                  onFeature={() => handleFeature(trek.id)}
                  onToggleShow={() => toggleShown(trek.id)}
                />
              );
            })}
          </ul>
        ) : (
          <p className="m-0 rounded-lg border border-dashed border-line-strong bg-page px-4 py-6 text-center text-caption text-muted-foreground">
            No treks in {name} yet. Open a trek and choose this region, and it shows here.
          </p>
        )}
        <FieldError id="featured-trek-error" message={errors.featuredTrekId} />
        <div className="grid gap-3 tablet:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <TextField
            name="featuredTrekLabel"
            label="Label above it"
            defaultValue={values.featuredTrekLabel}
            placeholder={`Our signature ${regionName.trim() || "region"} trek`}
            maxLength={LIMIT.featuredTrekLabel}
            error={errors.featuredTrekLabel}
          />
          <TextField
            name="featuredTrekPitch"
            label="Why this trek"
            multiline
            rows={2}
            defaultValue={values.featuredTrekPitch}
            placeholder="From the river gorge to the monastery village and a sunrise on the viewpoint."
            maxLength={LIMIT.featuredTrekPitch}
            error={errors.featuredTrekPitch}
          />
        </div>
      </FormSection>

      <MoreTreksCard list={more} regionTreks={regionTreks} regionName={name} errors={errors} />

      <FormSection title="Want your own route?" hint="The green box beside the treks under the featured one, with a WhatsApp link.">
        <TextField
          name="customRoutePitch"
          label="What can be changed"
          multiline
          rows={2}
          defaultValue={values.customRoutePitch}
          placeholder="Combine two treks, a shorter version, or an extra viewpoint. We plan it around your days."
          maxLength={LIMIT.customRoutePitch}
          error={errors.customRoutePitch}
        />
      </FormSection>
    </>
  );
};
