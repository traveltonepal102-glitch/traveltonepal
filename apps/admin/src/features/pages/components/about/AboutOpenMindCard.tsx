import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import { LibraryPhotoField } from "@/features/photos/components/LibraryPhotoField";
import type { Photo } from "@/features/photos/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { AboutOpenMind } from "../../aboutTypes";
import { ABOUT_PHOTO_SLOTS, PAGE_LIMITS as LIMIT } from "../../constants";
import { BeliefCardFields, BeliefTextFields, FieldGroup, TitledRows } from "./AboutFieldParts";

const BASE = "openMind";

type AboutOpenMindCardProps = { values: AboutOpenMind; photos: (Photo | null)[]; libraryPhotos: Photo[]; errors: FieldErrors; onEdit: () => void };

/** 04 "An open mind": its card, its text, three villages with photos, how we invite you in and the closing quote. */
export const AboutOpenMindCard = ({ values, photos, libraryPhotos, errors, onEdit }: AboutOpenMindCardProps) => (
  <FormSection title="04 · An open mind">
    <BeliefCardFields base={BASE} values={values} errors={errors} />
    <BeliefTextFields base={BASE} values={values} errors={errors} />
    <TextField
      name={`${BASE}.more`}
      label="More text (right column)"
      hint="Leave an empty line between paragraphs."
      multiline
      rows={5}
      defaultValue={values.more}
      maxLength={LIMIT.beliefBody}
      error={errors[`${BASE}.more`]}
    />
    <FieldGroup title="Three villages, each with a photo">
      <div className="grid gap-3 desktop:grid-cols-3">
        {values.places.map((place, index) => (
          <div key={index} className="flex flex-col gap-2">
            <LibraryPhotoField
              name={`photoIds.${ABOUT_PHOTO_SLOTS.places[index]}`}
              label={`Photo ${index + 1}`}
              emptyText="No photo: the village is left out."
              initial={photos[index] ?? null}
              photos={libraryPhotos}
              onEdit={onEdit}
            />
            <TextField name={`${BASE}.places.${index}.title`} label="Place" placeholder="Ghandruk, Annapurna" defaultValue={place.title} maxLength={LIMIT.itemTitle} error={errors[`${BASE}.places.${index}.title`]} />
            <TextField name={`${BASE}.places.${index}.text`} label="Line under it" multiline rows={2} defaultValue={place.text} maxLength={LIMIT.itemText} error={errors[`${BASE}.places.${index}.text`]} />
          </div>
        ))}
      </div>
    </FieldGroup>
    <TextField name={`${BASE}.inviteHeading`} label="Heading of the invitations" defaultValue={values.inviteHeading} maxLength={LIMIT.beliefHeading} error={errors[`${BASE}.inviteHeading`]} />
    <TitledRows base={`${BASE}.invites`} title="How we invite you in (bold start, then the text)" itemLabel="Invitation" rows={values.invites} errors={errors} />
    <TextField name={`${BASE}.inviteNote`} label="Small line under them" defaultValue={values.inviteNote} maxLength={LIMIT.note} error={errors[`${BASE}.inviteNote`]} />
    <TextField name={`${BASE}.quoteNote`} label="Line under the big quote" labelNote="(the orange box)" defaultValue={values.quoteNote} maxLength={LIMIT.quoteNote} error={errors[`${BASE}.quoteNote`]} />
  </FormSection>
);
