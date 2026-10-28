"use client";

import Link from "next/link";

import { FormSection } from "@/components/ui/FormSection";
import { RichTextEditor } from "@/components/ui/richText/RichTextEditor";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import { AUTHORS_PATH } from "@/features/authors/constants";
import { LibraryPhotoField } from "@/features/photos/components/LibraryPhotoField";
import type { Photo } from "@/features/photos/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { ABOUT_PHOTO_SLOTS, PAGE_LIMITS as LIMIT } from "../../constants";
import type { AboutPageValues } from "../../types";
import { FieldGroup, TitledRows } from "./AboutFieldParts";

type AboutStoryCardProps = {
  values: AboutPageValues;
  /** Office authors: the founder (name and job title, also on every trek page). */
  officeAuthors: { id: string; name: string; jobTitle: string }[];
  founderPhoto: Photo | null;
  libraryPhotos: Photo[];
  errors: FieldErrors;
  onEdit: () => void;
};

/** "Our story": the founder and his photo, why he started the company, three goals, "Our voice" and the trek page teaser. */
export const AboutStoryCard = ({ values, officeAuthors, founderPhoto, libraryPhotos, errors, onEdit }: AboutStoryCardProps) => (
  <FormSection title="Our story">
    <FieldGroup title="The founder">
      <div className="grid gap-3 tablet:grid-cols-2">
        <div className="flex flex-col gap-1">
          <SelectField
            name="founderAuthorId"
            label="Founder"
            hint="From the office team in Authors: the name and job title come from there."
            options={[{ value: "", label: "No one" }, ...officeAuthors.map((author) => ({ value: author.id, label: `${author.name}${author.jobTitle ? ` · ${author.jobTitle}` : ""}` }))]}
            defaultValue={values.founderAuthorId ?? ""}
            error={errors.founderAuthorId}
          />
          <Link href={AUTHORS_PATH} className="self-start text-caption font-bold text-brand">
            Add someone in Authors
          </Link>
        </div>
        <TextField name="founderOrigin" label="Where he is from" placeholder="From Tanahun, near the Annapurna region" defaultValue={values.founderOrigin} maxLength={LIMIT.founderOrigin} error={errors.founderOrigin} />
      </div>
      <LibraryPhotoField name={`photoIds.${ABOUT_PHOTO_SLOTS.founder}`} label="Founder's photo" hint="A tall photo of the founder on the trail works best." emptyText="No photo yet." initial={founderPhoto} photos={libraryPhotos} onEdit={onEdit} />
    </FieldGroup>
    <TextField name="storyHeading" label="Heading" labelNote="(H2)" placeholder="Why Sandip Kshetri started Travel To Nepal" defaultValue={values.storyHeading} maxLength={LIMIT.beliefHeading} inputClassName="font-display font-bold" error={errors.storyHeading} />
    <RichTextEditor
      name="storyText"
      label="Why he started the company"
      hint="Two short paragraphs, before the three goals."
      defaultValue={values.storyText}
      maxLength={LIMIT.storyText}
      error={errors.storyText}
      onEdit={onEdit}
    />
    <TitledRows base="goals" title="Three goals" itemLabel="Goal" rows={values.goals} errors={errors} />
    <FieldGroup title="Our voice (the yellow box)">
      <div className="grid gap-3 tablet:grid-cols-[1fr_2fr]">
        <TextField name="voiceEyebrow" label="Small label" defaultValue={values.voiceEyebrow} maxLength={LIMIT.beliefEyebrow} error={errors.voiceEyebrow} />
        <TextField name="voiceHeading" label="Heading" defaultValue={values.voiceHeading} maxLength={LIMIT.beliefHeading} error={errors.voiceHeading} />
      </div>
      <TextField name="voiceText" label="Text" hint="Leave an empty line between paragraphs." multiline rows={6} defaultValue={values.voiceText} maxLength={LIMIT.beliefBody} showCount error={errors.voiceText} />
      <TextField name="quote" label="Quote" hint="Shown with the founder's name." defaultValue={values.quote} maxLength={LIMIT.quote} error={errors.quote} />
    </FieldGroup>
    <TextField
      name="storyTeaser"
      label="Short story for trek pages"
      hint="Not on this page: shown on every trek page next to the founder, with a link to this story."
      multiline
      rows={3}
      defaultValue={values.storyTeaser}
      maxLength={LIMIT.storyTeaser}
      showCount
      error={errors.storyTeaser}
    />
  </FormSection>
);
