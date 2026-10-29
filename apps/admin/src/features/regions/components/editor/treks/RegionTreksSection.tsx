"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";
import { useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import { TREKS_PATH, difficultyOf, trekPath } from "@/features/treks/constants";
import type { SimilarTrekOption } from "@/features/treks/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { REGION_LIMITS as LIMIT } from "../../../constants";
import type { RegionValues } from "../../../types";
import { NearbyTreksCard } from "./NearbyTreksCard";

type RegionTreksSectionProps = {
  values: RegionValues;
  /** null for a new region. */
  regionId: string | null;
  regionName: string;
  /** The treks whose main region this is (A–Z), then the treks that pass through it (from the trek editor). */
  regionTreks: SimilarTrekOption[];
  /** Treks that don't touch this region, to suggest as nearby. */
  otherTreks: SimilarTrekOption[];
  errors: FieldErrors;
  onEdit: () => void;
};

/**
 * "Trek in …" on the region page (design: section "treks"): the region's own treks with one featured, nearby
 * treks from other regions, and the "Want your own route?" line. The treks themselves are listed, not picked.
 */
export const RegionTreksSection = ({ values, regionId, regionName, regionTreks, otherTreks, errors, onEdit }: RegionTreksSectionProps) => {
  // A featured trek moved to another region since the last save no longer counts.
  const [featuredId, setFeaturedId] = useState(regionTreks.some((trek) => trek.id === values.featuredTrekId) ? values.featuredTrekId : null);
  const name = regionName.trim() || "this region";

  return (
    <>
      <FormSection
        title={`Treks in ${name}`}
        hint={`A trek joins this region when you add “${name}” to its regions on the route in the trek editor: first, or as a region it passes through. Pick the one to feature.`}
        aside={
          <Link href={TREKS_PATH} className={cn(secondaryButton, "min-h-8 px-3 text-caption")}>
            Open Treks
          </Link>
        }
      >
        <input type="hidden" name="featuredTrekId" value={featuredId ?? ""} />
        {regionTreks.length ? (
          <ul role="radiogroup" aria-label="Featured trek" className="m-0 flex list-none flex-col gap-2 p-0">
            {regionTreks.map((trek) => {
              const isFeatured = trek.id === featuredId;
              return (
                <li key={trek.id} className={cn("flex items-center gap-3 rounded-lg border border-solid p-2.5", isFeatured ? "border-brand/30 bg-brand-tint" : "border-border")}>
                  <span className="inline-flex h-14 w-20 flex-none items-center justify-center overflow-hidden rounded-md bg-page text-subtle">
                    {trek.cover ? <PhotoImage photo={trek.cover} alt="" sizes="80px" className="h-full w-full object-cover" /> : <Icon name="landscape" size={24} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-ink">{trek.name}</span>
                    <span className="block text-caption text-muted-foreground">
                      {trek.days} days · {difficultyOf(trek.difficulty).label}
                      {trek.regionId !== regionId && ` · Passes through, starts in ${trek.regionName}`}
                    </span>
                  </span>
                  <label className="flex cursor-pointer items-center gap-2 text-caption font-bold">
                    <input
                      type="radio"
                      // Not read on Save (the hidden featuredTrekId is): the shared name groups the radios for arrow keys.
                      name="featuredTrekChoice"
                      checked={isFeatured}
                      onChange={() => {
                        setFeaturedId(trek.id);
                        onEdit();
                      }}
                      className="size-4 accent-brand"
                    />
                    <span className={isFeatured ? "text-brand" : "text-muted-foreground"}>{isFeatured ? "Featured trek" : "Feature this"}</span>
                  </label>
                  <Link href={trekPath(trek.id)} className={cn(secondaryButton, "min-h-8 px-3 text-caption max-tablet:hidden")}>
                    Edit trek
                  </Link>
                </li>
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

      <NearbyTreksCard nearbyTreks={values.nearbyTreks} options={otherTreks} regionName={name} errors={errors} onEdit={onEdit} />

      <FormSection title="Want your own route?" hint="The green box next to the nearby treks, with a WhatsApp link.">
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
