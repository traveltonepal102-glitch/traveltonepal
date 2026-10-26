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

import { MAX_STORY_PHOTOS, PAGE_LIMITS as LIMIT } from "../../constants";
import type { AboutPageValues } from "../../types";
import { SectionHeadingFields } from "../SectionHeadingFields";

type AboutStoryCardProps = {
  values: AboutPageValues;
  /** Office authors: who the quote is by (the founder, also shown on every trek page). */
  officeAuthors: { id: string; name: string; jobTitle: string }[];
  storyPhotos: Photo[];
  libraryPhotos: Photo[];
  errors: FieldErrors;
  onEdit: () => void;
};

/** "Our story": the heading, the founder's story, the quote and who it is by, the short story and three photos. */
export const AboutStoryCard = ({ values, officeAuthors, storyPhotos, libraryPhotos, errors, onEdit }: AboutStoryCardProps) => (
  <FormSection title="The founder’s story">
    <SectionHeadingFields eyebrow="Our story" heading={{ name: "storyHeading", value: values.storyHeading, placeholder: "Born in the mountains, built in Kathmandu" }} errors={errors} />
    <RichTextEditor
      name="storyText"
      label="The founder’s story"
      hint="Written in the founder’s own words. Two short paragraphs read best."
      defaultValue={values.storyText}
      maxLength={LIMIT.storyText}
      error={errors.storyText}
      onEdit={onEdit}
    />
    <div className="grid gap-3 tablet:grid-cols-2">
      <TextField name="quote" label="Quote" labelNote="(optional)" defaultValue={values.quote} maxLength={LIMIT.quote} error={errors.quote} />
      <div className="flex flex-col gap-1">
        <SelectField
          name="founderAuthorId"
          label="Quote by"
          hint="The founder, from the office team in Authors (name, job title and photo come from there)."
          options={[{ value: "", label: "No one" }, ...officeAuthors.map((author) => ({ value: author.id, label: `${author.name}${author.jobTitle ? ` · ${author.jobTitle}` : ""}` }))]}
          defaultValue={values.founderAuthorId ?? ""}
          error={errors.founderAuthorId}
        />
        <Link href={AUTHORS_PATH} className="self-start text-caption font-bold text-brand">
          Add someone in Authors
        </Link>
      </div>
    </div>
    <TextField
      name="storyTeaser"
      label="Short story for trek pages"
      hint="Shown on every trek page next to the founder, with a link to this story."
      multiline
      rows={3}
      defaultValue={values.storyTeaser}
      maxLength={LIMIT.storyTeaser}
      showCount
      error={errors.storyTeaser}
    />
    <div className="flex flex-col gap-1.5">
      <span className="text-caption font-semibold text-ink">Three photos next to the story</span>
      <div className="grid gap-3 tablet:grid-cols-3">
        {Array.from({ length: MAX_STORY_PHOTOS }, (_, index) => (
          <LibraryPhotoField
            key={index}
            name="storyPhotoId"
            label={index === 0 ? "Photo 1 (tall)" : `Photo ${index + 1}`}
            initial={storyPhotos[index] ?? null}
            photos={libraryPhotos}
            onEdit={onEdit}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">A team photo at the office works well as one of them. The photo’s place is its description.</span>
      {errors.storyPhotoIds && <p className="m-0 text-caption text-danger">{errors.storyPhotoIds}</p>}
    </div>
  </FormSection>
);
