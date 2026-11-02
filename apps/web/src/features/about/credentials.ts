import type { IconName } from "@ttn/ui/icon";

import type { SiteSettings } from "@/features/site-settings/types";
import type { SiteImageSource } from "@/lib/images";

export type CredentialTone = "green" | "brand" | "ink";

export type CompanyCredentials = {
  /** Year the agency was founded, e.g. "2015"; empty until it is typed in Site settings. */
  foundedYear: string;
  facts: readonly { label: string; value: string; tone: CredentialTone }[];
  certificate: {
    title: string;
    /** Scan of the certificate; the "view" button appears once it is added. */
    image?: SiteImageSource;
  };
};

const CERTIFICATE_TITLE = "Nepal Department of Tourism registration certificate";

/**
 * The trek pages' "Credentials" card, from Site settings (the one place for these numbers). A number not typed in
 * yet is left out, never shown as a placeholder.
 */
export const credentialsFor = (settings: SiteSettings): CompanyCredentials => {
  const { company } = settings;
  const facts: CompanyCredentials["facts"] = [
    { label: "Govt. reg.", value: company.tourismRegistration, tone: "green" },
    { label: "Tourism licence", value: company.tourismLicence, tone: "brand" },
    { label: "Memberships", value: company.memberships.join(" · "), tone: "ink" },
  ];
  return {
    foundedYear: company.foundedYear ? String(company.foundedYear) : "",
    facts: facts.filter((fact) => fact.value),
    certificate: { title: CERTIFICATE_TITLE, image: company.certificate },
  };
};

export type Licence = { icon: IconName; label: string; value: string };

/**
 * The About page's "Licences and legal" list: everything a visitor can check with the Department of Tourism, from
 * Site settings. Only the ones typed in are listed.
 */
export const licencesFor = ({ company }: SiteSettings): Licence[] =>
  [
    { icon: "verified", label: "Department of Tourism", value: company.tourismRegistration && `Reg. ${company.tourismRegistration}` },
    { icon: "description", label: "Tourism licence", value: company.tourismLicence },
    { icon: "description", label: "Tax number (PAN)", value: company.panNumber },
    { icon: "shield_person", label: "Staff insurance", value: company.staffInsurer },
    { icon: "groups", label: "Memberships", value: company.memberships.join(", ") },
  ].filter((licence): licence is Licence => Boolean(licence.value));
