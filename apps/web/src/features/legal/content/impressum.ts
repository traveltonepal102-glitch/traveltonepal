import type { SiteSettings } from "@/features/site-settings/types";

import { companyLegalName, companyRegisters } from "../legalCompany";
import type { LegalDoc } from "../types";

/** Template from the website design (Legal.dc.html). Company, contact and register numbers from Site settings; [BRACKETED] values wait for the owner. */
export const impressumDoc = (settings: SiteSettings): LegalDoc => ({
  slug: "impressum",
  title: "Impressum",
  updated: "[DATE]",
  intro: "Legal notice for this website (information under § 5 DDG and § 18 MStV for visitors from Germany).",
  ownerNote: "Fill in every bracket with your real company details. The Impressum must be complete and reachable from every page.",
  sections: [
    { id: "provider", heading: "Provider", paragraphs: [companyLegalName(settings), settings.contact.officeAddress].filter(Boolean) },
    { id: "represented-by", heading: "Represented by", paragraphs: ["[NAME], Managing Director"] },
    { id: "contact", heading: "Contact", list: [`Phone and WhatsApp: ${settings.contact.phoneDisplay}`, `Email: ${settings.contact.email}`] },
    {
      id: "registration",
      heading: "Registration and licences",
      table: {
        head: ["Register", "Number"],
        rows: companyRegisters(settings),
      },
    },
    { id: "responsible-for-content", heading: "Responsible for content", paragraphs: ["[NAME], [ADDRESS] (§ 18 para. 2 MStV)"] },
    {
      id: "dispute-resolution",
      heading: "Consumer dispute resolution",
      paragraphs: [
        "We are not willing or obliged to take part in dispute resolution proceedings before a consumer arbitration board. [Confirm with your lawyer.]",
      ],
    },
    { id: "photos", heading: "Photos", paragraphs: ["All photos on this website are our own unless stated otherwise. [Photo credits, if any]."] },
  ],
});
