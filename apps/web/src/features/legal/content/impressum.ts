import { CONTACT } from "@ttn/config/contact";

import type { LegalDoc } from "../types";

/** Template from the website design (Legal.dc.html). Contact and register numbers from CONTACT; [BRACKETED] values wait for the owner. */
export const IMPRESSUM: LegalDoc = {
  slug: "impressum",
  label: "Impressum",
  title: "Impressum",
  icon: "verified",
  updated: "[DATE]",
  intro: "Legal notice for this website (information under § 5 DDG and § 18 MStV for visitors from Germany).",
  ownerNote: "Fill in every bracket with your real company details. The Impressum must be complete and reachable from every page.",
  sections: [
    { id: "provider", heading: "Provider", paragraphs: ["[COMPANY LEGAL NAME] ([LEGAL FORM, e.g. Pvt. Ltd.])", CONTACT.officeAddress] },
    { id: "represented-by", heading: "Represented by", paragraphs: ["[NAME], Managing Director"] },
    { id: "contact", heading: "Contact", list: [`Phone and WhatsApp: ${CONTACT.phoneDisplay}`, `Email: ${CONTACT.email}`] },
    {
      id: "registration",
      heading: "Registration and licences",
      table: {
        head: ["Register", "Number"],
        rows: [
          ["Office of the Company Registrar, Nepal", "[NUMBER]"],
          ["Department of Tourism, trekking agency licence", CONTACT.registrationNumber],
          ["Tax number (PAN / VAT)", "[NUMBER]"],
          ["TAAN membership", CONTACT.taanMemberNumber],
        ],
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
};
