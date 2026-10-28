import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import { LibraryPhotoField } from "@/features/photos/components/LibraryPhotoField";
import type { Photo } from "@/features/photos/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { AboutFlexible } from "../../aboutTypes";
import { ABOUT_PHOTO_SLOTS, PAGE_LIMITS as LIMIT } from "../../constants";
import { BeliefCardFields, BeliefTextFields, FieldGroup, TitledRows } from "./AboutFieldParts";

const BASE = "flexible";

type AboutFlexibleCardProps = { values: AboutFlexible; photo: Photo | null; libraryPhotos: Photo[]; errors: FieldErrors; onEdit: () => void };

/** 03 "Private and flexible": its card, its text and quote, the photo, how the trek stays flexible and where it stops. */
export const AboutFlexibleCard = ({ values, photo, libraryPhotos, errors, onEdit }: AboutFlexibleCardProps) => (
  <FormSection title="03 · Private and flexible">
    <BeliefCardFields base={BASE} values={values} errors={errors} />
    <BeliefTextFields base={BASE} values={values} errors={errors} />
    <TextField name={`${BASE}.quoteNote`} label="Line under the quote" labelNote="(optional)" defaultValue={values.quoteNote} maxLength={LIMIT.quoteNote} error={errors[`${BASE}.quoteNote`]} />
    <FieldGroup title="Photo beside the text">
      <LibraryPhotoField name={`photoIds.${ABOUT_PHOTO_SLOTS.flexible}`} label="Photo" hint="A tall photo works best." emptyText="No photo: the text uses the full width." initial={photo} photos={libraryPhotos} onEdit={onEdit} />
      <TextField
        name={`${BASE}.photoCaption`}
        label="Caption on the photo"
        hint="Also what the photo shows, for blind visitors and Google."
        defaultValue={values.photoCaption}
        maxLength={LIMIT.itemTitle}
        error={errors[`${BASE}.photoCaption`]}
      />
    </FieldGroup>
    <TextField name={`${BASE}.stagesHeading`} label="Heading above the stages" defaultValue={values.stagesHeading} maxLength={LIMIT.beliefHeading} error={errors[`${BASE}.stagesHeading`]} />
    <TitledRows base={`${BASE}.stages`} title="How your trek stays flexible" itemLabel="Stage" rows={values.stages} errors={errors} columns={4} />
    <FieldGroup title="Where flexibility stops (the yellow box)">
      <TextField name={`${BASE}.limitsLead`} label="Bold start" defaultValue={values.limitsLead} maxLength={LIMIT.itemTitle} error={errors[`${BASE}.limitsLead`]} />
      <TextField name={`${BASE}.limitsText`} label="Text" multiline rows={3} defaultValue={values.limitsText} maxLength={LIMIT.note} error={errors[`${BASE}.limitsText`]} />
    </FieldGroup>
  </FormSection>
);
