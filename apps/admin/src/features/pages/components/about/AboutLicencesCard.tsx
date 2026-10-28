import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FormSection } from "@/components/ui/FormSection";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { AboutFacts, AboutPageValues } from "../../types";
import { SectionHeadingFields } from "../SectionHeadingFields";

type AboutLicencesCardProps = { values: AboutPageValues; facts: AboutFacts; errors: FieldErrors };

/** "Licences and legal": the heading and line here; the numbers and the two certificate scans are read from Site settings. */
export const AboutLicencesCard = ({ values, facts, errors }: AboutLicencesCardProps) => (
  <FormSection
    title="Numbers and certificates"
    hint="The same numbers are used in the Impressum and on trek pages (“Credentials and government licences”), so they are typed once, in Site settings."
    aside={
      <Link href={ADMIN_SECTIONS.settings.href} className={cn(secondaryButton, "min-h-8 px-2.5 text-caption")}>
        <Icon name="settings" size={16} />
        Open Site settings
      </Link>
    }
  >
    <SectionHeadingFields
      eyebrow="Licences and legal"
      heading={{ name: "licencesHeading", value: values.licencesHeading, placeholder: "Registered, licensed and insured" }}
      intro={{ name: "licencesIntro", value: values.licencesIntro, placeholder: "You can check every number below with the Nepal Department of Tourism and TAAN." }}
      errors={errors}
    />
    {facts.licences.length ? (
      <dl className="m-0 grid gap-2 tablet:grid-cols-2">
        {facts.licences.map((licence) => (
          <div key={licence.label} className="flex flex-col rounded-md border border-solid border-border bg-surface px-3 py-2">
            <dt className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">{licence.label}</dt>
            <dd className="m-0 font-bold text-ink">{licence.value}</dd>
          </div>
        ))}
      </dl>
    ) : (
      <p className="m-0 text-caption text-saffron-ink">No numbers yet: add them in Site settings › Company and licences.</p>
    )}
    {[
      { isAdded: facts.hasCertificate, name: "Trekking agency licence" },
      { isAdded: facts.hasPanCertificate, name: "PAN registration certificate" },
    ].map((scan) => (
      <p key={scan.name} className={cn("m-0 flex items-center gap-2 text-caption font-semibold", scan.isAdded ? "text-whatsapp" : "text-saffron-ink")}>
        <Icon name={scan.isAdded ? "check_circle" : "warning"} size={18} />
        {scan.isAdded ? `${scan.name} scan added. Visitors can open it full size.` : `${scan.name} scan not added yet (Site settings). Cover any private numbers first.`}
      </p>
    ))}
  </FormSection>
);
