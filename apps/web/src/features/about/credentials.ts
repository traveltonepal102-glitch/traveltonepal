import { CONTACT } from "@ttn/config/contact";

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
