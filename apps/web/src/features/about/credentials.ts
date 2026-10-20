import { CONTACT } from "@ttn/config/contact";
import type { IconName } from "@ttn/ui/icon";

export type CredentialTone = "green" | "brand" | "ink";

export type CompanyCredentials = {
  /** Year the agency was registered, e.g. "2015". */
  foundedYear: string;
  facts: readonly { label: string; value: string; tone: CredentialTone }[];
  certificate: {
    title: string;
    /** Scan of the certificate; the "view" button appears once it is added. */
    image?: { src: string; alt: string };
  };
};

/**
 * Licences and memberships for the trek pages' "Credentials" card. Registration and TAAN numbers come
 * from CONTACT (the one place for them); every [BRACKETED] value waits for the owner's documents.
 */
export const CREDENTIALS: CompanyCredentials = {
  foundedYear: "[YEAR]",
  facts: [
    { label: "Govt. reg.", value: CONTACT.registrationNumber, tone: "green" },
    { label: "Tourism licence", value: "[NUMBER]", tone: "brand" },
    { label: "Memberships", value: `TAAN ${CONTACT.taanMemberNumber} · [OTHER]`, tone: "ink" },
    { label: "Payments", value: "[BANK / LICENCE]", tone: "ink" },
  ],
  certificate: { title: "Nepal Department of Tourism registration certificate" },
};

export type Licence = { icon: IconName; label: string; value: string };

/**
 * The About page's "Licences and legal" list: everything a visitor can check with the Department of
 * Tourism and TAAN. Numbers from CONTACT; [BRACKETED] values wait for the owner's documents.
 */
export const LICENCES: readonly Licence[] = [
  { icon: "verified", label: "Department of Tourism", value: `Reg. ${CONTACT.registrationNumber}` },
  { icon: "description", label: "Company registration", value: "[NUMBER]" },
  { icon: "groups", label: "TAAN member", value: `No. ${CONTACT.taanMemberNumber}` },
  { icon: "description", label: "Tax number (PAN)", value: "[NUMBER]" },
  { icon: "shield_person", label: "Staff insurance", value: "[INSURER]" },
  { icon: "flag", label: "Other memberships", value: "[e.g. NMA, KEEP]" },
];
