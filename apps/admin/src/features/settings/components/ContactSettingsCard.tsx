import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { FormSection } from "@/components/ui/FormSection";
import { TagListField } from "@/components/ui/TagListField";
import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { LANGUAGE_SUGGESTIONS, MAX_REPLY_LANGUAGES, SETTINGS_LIMITS as LIMIT, WEEKDAYS } from "../constants";
import type { SiteSettingsValues } from "../types";

type ContactSettingsCardProps = { values: SiteSettingsValues; errors: FieldErrors; onEdit: () => void };

/** "Contact details": the one place for the phone/WhatsApp number, email, address and office hours. */
export const ContactSettingsCard = ({ values, errors, onEdit }: ContactSettingsCardProps) => (
  <FormSection title="Contact details" hint="Shown on every page of the website: header, footer, Contact and About. WhatsApp buttons open a chat with this number.">
    <div className="grid gap-3 tablet:grid-cols-[120px_minmax(0,1fr)]">
      <TextField name="phoneCountryCode" label="Country code" defaultValue={values.phoneCountryCode} placeholder="977" inputMode="numeric" error={errors.phoneCountryCode} />
      <TextField name="phoneNumber" label="Phone and WhatsApp number" hint="Digits only, without the country code." defaultValue={values.phoneNumber} placeholder="9843197197" inputMode="tel" error={errors.phoneNumber} />
    </div>
    <TextField name="email" label="Email" defaultValue={values.email} placeholder="hello@traveltonepal.com" inputMode="email" maxLength={LIMIT.email} error={errors.email} />
    <TextField name="officeAddress" label="Office address" defaultValue={values.officeAddress} placeholder="Thamel, Kathmandu, Nepal" maxLength={LIMIT.officeAddress} error={errors.officeAddress} />
    <TextField
      name="googleMapsUrl"
      label="Google Maps link"
      labelNote="(optional)"
      defaultValue={values.googleMapsUrl}
      placeholder="https://maps.app.goo.gl/…"
      maxLength={LIMIT.url}
      hint="Find the office on Google Maps › Share › Copy link. The website's “Open in Google Maps” buttons lead here (without it, they search for the address)."
      error={errors.googleMapsUrl}
    />
    <TextField
      name="googleMapsEmbedUrl"
      label="Map on the website"
      labelNote="(optional)"
      defaultValue={values.googleMapsEmbedUrl}
      placeholder={'<iframe src="https://www.google.com/maps/embed?pb=…"></iframe>'}
      maxLength={LIMIT.mapEmbedCode}
      multiline
      rows={3}
      hint="Google Maps › Share › Embed a map › Copy HTML, then paste it here. Contact and About show this map once a visitor allows external media or clicks “Show the map”; until then they show a drawn map."
      error={errors.googleMapsEmbedUrl}
    />
    <ChoiceChips legend="Office open on" name="officeDay" type="checkbox" options={WEEKDAYS} defaultValues={values.officeDays.map(String)} onChange={onEdit} error={errors.officeDays} />
    <div className="grid gap-3 tablet:grid-cols-2">
      <TextField name="officeOpens" label="Opens" labelNote="(Nepal time)" defaultValue={values.officeOpens} placeholder="09:00" error={errors.officeOpens} />
      <TextField name="officeCloses" label="Closes" labelNote="(Nepal time)" defaultValue={values.officeCloses} placeholder="18:00" error={errors.officeCloses} />
    </div>
    <TagListField
      label="Languages we reply in"
      name="replyLanguage"
      initial={values.replyLanguages}
      suggestions={LANGUAGE_SUGGESTIONS}
      maxItems={MAX_REPLY_LANGUAGES}
      maxLength={LIMIT.item}
      placeholder="Add a language"
      error={errors.replyLanguages}
      onEdit={onEdit}
    />
  </FormSection>
);
