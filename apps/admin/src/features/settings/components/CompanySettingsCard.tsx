import { FormSection } from "@/components/ui/FormSection";
import { TagListField } from "@/components/ui/TagListField";
import { TextField } from "@/components/ui/TextField";
import { PersonPhotoField } from "@/features/photos/components/PersonPhotoField";
import type { Photo } from "@/features/photos/types";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { MAX_MEMBERSHIPS, MEMBERSHIP_SUGGESTIONS, SETTINGS_LIMITS as LIMIT } from "../constants";
import type { SiteSettingsValues } from "../types";

type CompanySettingsCardProps = { values: SiteSettingsValues; certificate: Photo | null; errors: FieldErrors; onEdit: () => void };

/**
 * "Company and licences": the numbers visitors can check with the Department of Tourism and TAAN, used by the About
 * page, every trek page ("Credentials and government licences") and the Impressum. A blank one isn't shown.
 */
export const CompanySettingsCard = ({ values, certificate, errors, onEdit }: CompanySettingsCardProps) => (
  <FormSection title="Company and licences" hint="Type the real numbers from your documents. A field left empty is left out of the website, never shown as a placeholder.">
    <div className="grid gap-3 tablet:grid-cols-2">
      <TextField name="legalName" label="Company's legal name" defaultValue={values.legalName} placeholder="Travel To Nepal Pvt. Ltd." maxLength={LIMIT.legalName} error={errors.legalName} />
      <TextField name="legalForm" label="Legal form" defaultValue={values.legalForm} placeholder="Private limited company" maxLength={LIMIT.legalForm} error={errors.legalForm} />
      <TextField name="foundedYear" label="Founded in" defaultValue={values.foundedYear?.toString() ?? ""} placeholder="2015" inputMode="numeric" error={errors.foundedYear} />
      <TextField name="tourismRegistration" label="Department of Tourism registration" defaultValue={values.tourismRegistration} maxLength={LIMIT.registration} error={errors.tourismRegistration} />
      <TextField name="tourismLicence" label="Tourism licence" defaultValue={values.tourismLicence} maxLength={LIMIT.registration} error={errors.tourismLicence} />
      <TextField name="companyRegistration" label="Company registration" defaultValue={values.companyRegistration} maxLength={LIMIT.registration} error={errors.companyRegistration} />
      <TextField name="panNumber" label="Tax number (PAN)" defaultValue={values.panNumber} maxLength={LIMIT.pan} error={errors.panNumber} />
      <TextField name="taanNumber" label="TAAN membership number" defaultValue={values.taanNumber} maxLength={LIMIT.taan} error={errors.taanNumber} />
      <TextField name="staffInsurer" label="Staff insurance" labelNote="(insurer)" defaultValue={values.staffInsurer} maxLength={LIMIT.staffInsurer} error={errors.staffInsurer} />
      <TextField name="paymentsNote" label="Payments" hint="e.g. the bank or how trekkers pay." defaultValue={values.paymentsNote} maxLength={LIMIT.paymentsNote} error={errors.paymentsNote} />
    </div>
    <TagListField
      label="Other memberships"
      name="membership"
      initial={values.memberships}
      suggestions={MEMBERSHIP_SUGGESTIONS}
      maxItems={MAX_MEMBERSHIPS}
      maxLength={LIMIT.item}
      placeholder="Add a membership"
      error={errors.memberships}
      onEdit={onEdit}
    />
    <div className="flex flex-col gap-1.5">
      <span className="text-caption font-semibold text-ink">Registration certificate scan</span>
      <PersonPhotoField
        initial={certificate}
        name="Department of Tourism registration certificate"
        hint="A clear photo or scan. Visitors can open it full size, so cover any private numbers first."
        fieldName="certificatePhotoId"
        onEdit={onEdit}
      />
    </div>
  </FormSection>
);
