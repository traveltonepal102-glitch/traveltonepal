"use client";

import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import { PAGE_LIMITS } from "@/features/pages/constants";
import type { PageTopValues } from "@/features/pages/types";
import type { Photo } from "@/features/photos/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { HOME_TOP_LIMITS as LIMIT } from "../constants";
import type { HomeTopContent } from "../types";
import { HomeHeroPhotoField } from "./HomeHeroPhotoField";

type HomeTopCardProps = {
  values: PageTopValues & HomeTopContent;
  photo: Photo | null;
  regionId: string | null;
  errors: FieldErrors;
  onPhotoChange: (photo: Photo | null) => void;
};

/** "Top of the page" (always first, like a travel guide's): the photo, its description, the H1, the intro and the buttons. */
export const HomeTopCard = ({ values, photo, regionId, errors, onPhotoChange }: HomeTopCardProps) => (
  <FormSection title="Top of the page" hint="The first thing visitors see. The title is the page's H1 for Google too." aside={<span className="text-xs text-muted-foreground">Always first</span>}>
    <HomeHeroPhotoField photo={photo} regionId={regionId} error={errors.photoId} onChange={onPhotoChange} />
    <TextField
      name="photoAlt"
      label="Photo description"
      labelNote="(for Google and screen readers)"
      defaultValue={values.photoAlt}
      placeholder="Manaslu (8,163 m) above Samagaon on a clear autumn morning"
      maxLength={LIMIT.photoAlt}
      error={errors.photoAlt}
    />
    <TextField
      name="eyebrow"
      label="Small label above the title"
      labelNote="(optional)"
      defaultValue={values.eyebrow}
      placeholder="Manaslu Conservation Area · 2026/2027 season"
      maxLength={PAGE_LIMITS.eyebrow}
      error={errors.eyebrow}
    />
    <TextField
      name="heading"
      label="Title · H1"
      defaultValue={values.heading}
      placeholder="Manaslu Circuit Trek: 13 Days Itinerary and Cost"
      maxLength={PAGE_LIMITS.heading}
      recommendedLength={70}
      showCount
      error={errors.heading}
      inputClassName="h-14 font-display text-2xl font-extrabold"
    />
    <TextField name="intro" label="Intro" labelNote="(1–2 sentences under the title)" multiline rows={2} defaultValue={values.intro} maxLength={LIMIT.intro} showCount error={errors.intro} />
    <div className="grid gap-3.5 tablet:grid-cols-2">
      <TextField name="buttonLabel" label="WhatsApp button" defaultValue={values.buttonLabel} maxLength={LIMIT.buttonLabel} error={errors.buttonLabel} />
      <TextField
        name="secondLabel"
        label="Second button"
        labelNote="(optional)"
        hint="Jumps down to the first section."
        defaultValue={values.secondLabel}
        placeholder="See the itinerary"
        maxLength={LIMIT.buttonLabel}
        error={errors.secondLabel}
      />
    </div>
  </FormSection>
);
