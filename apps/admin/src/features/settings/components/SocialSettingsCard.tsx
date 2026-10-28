import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import { PersonPhotoField } from "@/features/photos/components/PersonPhotoField";
import type { Photo } from "@/features/photos/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { SETTINGS_LIMITS as LIMIT, SOCIAL_FIELDS } from "../constants";
import type { SiteSettingsValues } from "../types";

type SocialSettingsCardProps = { values: SiteSettingsValues; sharePhoto: Photo | null; errors: FieldErrors; onEdit: () => void };

/** "Social and sharing": profile links (footer, and Google's business details) and the picture for shared links. */
export const SocialSettingsCard = ({ values, sharePhoto, errors, onEdit }: SocialSettingsCardProps) => (
  <FormSection title="Social and sharing" hint="Only profiles you add are shown. Google also reads them to connect your website with your profiles.">
    <div className="grid gap-3 tablet:grid-cols-2">
      {SOCIAL_FIELDS.map((social) => (
        <TextField key={social.key} name={social.key} label={social.label} labelNote="(optional)" defaultValue={values[social.key]} placeholder={social.placeholder} maxLength={LIMIT.url} error={errors[social.key]} />
      ))}
    </div>
    <TextField
      name="googleReviewUrl"
      label="Google review link"
      labelNote="(optional)"
      defaultValue={values.googleReviewUrl}
      placeholder="https://g.page/r/…/review"
      maxLength={LIMIT.url}
      hint="Google Business Profile › Ask for reviews › copy the link. The website's “Write a review on Google” buttons and traveltonepal.com/review (the link to send trekkers after their trek) lead here."
      error={errors.googleReviewUrl}
    />
    <div className="flex flex-col gap-1.5">
      <span className="text-caption font-semibold text-ink">Picture for shared links</span>
      <PersonPhotoField
        initial={sharePhoto}
        name="Travel To Nepal"
        hint="Shown when a page without its own photo is shared on WhatsApp or social media. A wide mountain photo works best."
        fieldName="sharePhotoId"
        onEdit={onEdit}
      />
    </div>
  </FormSection>
);
