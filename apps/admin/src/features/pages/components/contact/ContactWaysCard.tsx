import Link from "next/link";

import { FormSection } from "@/components/ui/FormSection";
import { TextField } from "@/components/ui/TextField";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { PAGE_LIMITS as LIMIT } from "../../constants";
import type { ContactPageValues } from "../../types";

type ContactWaysCardProps = { values: ContactPageValues; errors: FieldErrors };

/** The WhatsApp and email boxes' reply times; the number, email and address are read from Site settings. */
export const ContactWaysCard = ({ values, errors }: ContactWaysCardProps) => (
  <FormSection title="Reply times">
    <p className="m-0 text-caption text-muted-foreground">
      The number, email, address, office hours and reply languages are kept in{" "}
      <Link href={ADMIN_SECTIONS.settings.href} className="font-bold text-brand">
        Site settings
      </Link>{" "}
      and shown on every page, so they can never be different on two pages.
    </p>
    <div className="grid gap-3 tablet:grid-cols-2">
      <TextField name="replyWhatsApp" label="On the WhatsApp box" defaultValue={values.replyWhatsApp} placeholder="Usually replies within a few hours" maxLength={LIMIT.replyTime} error={errors.replyWhatsApp} />
      <TextField name="replyEmail" label="On the email box" defaultValue={values.replyEmail} placeholder="Reply within 24 hours" maxLength={LIMIT.replyTime} error={errors.replyEmail} />
    </div>
  </FormSection>
);
