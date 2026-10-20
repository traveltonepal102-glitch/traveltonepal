import { CONTACT } from "@ttn/config/contact";

import type { LegalDoc } from "../types";

/** Template from the website design (Legal.dc.html); every [BRACKETED] value waits for the owner and their lawyer. */
export const TERMS: LegalDoc = {
  slug: "terms",
  label: "Terms and booking",
  title: "Terms and booking conditions",
  icon: "description",
  updated: "[DATE]",
  intro: "The conditions that apply when you book a trek with Travel To Nepal. Please read them before you pay a deposit.",
  ownerNote:
    "Template text. Have these terms checked by a lawyer, including whether EU package travel rules apply to your bookings from Germany.",
  sections: [
    {
      id: "who-we-are",
      heading: "Who we are",
      paragraphs: [
        `These conditions apply to treks organised by [COMPANY LEGAL NAME], ${CONTACT.officeAddress}, registered with the Department of Tourism under no. ${CONTACT.registrationNumber} ("we", "us").`,
      ],
    },
    {
      id: "booking",
      heading: "How booking works",
      paragraphs: [
        "You plan your trek with us on WhatsApp or by email. Your booking is confirmed when we have received your deposit and sent you a written confirmation with your itinerary and price.",
      ],
    },
    {
      id: "prices",
      heading: "Prices and payment",
      paragraphs: [
        "Prices are per person in US dollars and depend on group size. What is included and not included is listed on each trek page and in your confirmation.",
      ],
      list: [
        "Deposit: 10% of the trek price to confirm your booking",
        "Balance: due [WHEN, e.g. on arrival in Kathmandu]",
        "Accepted payment methods: [METHODS]",
      ],
    },
    {
      id: "cancellation",
      heading: "If you cancel",
      paragraphs: ["Please tell us in writing (email or WhatsApp). The cancellation fee depends on how long before your start date we hear from you:"],
      table: {
        head: ["When you cancel", "Fee"],
        rows: [
          ["More than 30 days before", "Free [confirm: deposit refunded?]"],
          ["30 to 15 days before", "[X]% of the trek price"],
          ["14 to 7 days before", "[X]% of the trek price"],
          ["Less than 7 days, or no-show", "[X]% of the trek price"],
        ],
      },
    },
    {
      id: "your-changes",
      heading: "Changes by you",
      paragraphs: [
        "You can change your dates, route or group size free of charge before departure, subject to availability. Extra costs, for example for extra days or permits, are charged at cost.",
      ],
    },
    {
      id: "our-changes",
      heading: "Changes and cancellation by us",
      paragraphs: [
        "Mountain weather, landslides, closed trails or safety concerns can force changes. Your guide may change the route or turn back if continuing is unsafe. If we cancel before departure, you get a full refund of what you paid us.",
      ],
    },
    {
      id: "insurance",
      heading: "Insurance, health and fitness",
      paragraphs: [
        "Travel insurance that covers trekking at the altitudes of your trek and helicopter rescue is required. You confirm that you are fit enough for the trek you book and tell us about relevant health conditions.",
      ],
    },
    {
      id: "documents",
      heading: "Documents and permits",
      paragraphs: [
        "You need a passport valid for at least six months and a Nepal visa. We arrange your trekking permits; you provide passport copies and photos in time.",
      ],
    },
    {
      id: "responsibility",
      heading: "Our responsibility",
      paragraphs: [
        "We are responsible for providing the services in your confirmation with reasonable care. [LIABILITY TERMS, to be written by your lawyer.]",
      ],
    },
    {
      id: "complaints",
      heading: "Complaints and applicable law",
      paragraphs: [
        "Please tell your guide or our office straight away if something is wrong, so we can fix it on the spot. [APPLICABLE LAW AND COURT].",
      ],
    },
  ],
};
