/**
 * Contact page copy, from the website design (Contact.dc.html). [BRACKETED] values wait for the
 * owner. Moves to Payload in the CMS phase.
 */

export const REPLY_TIMES = {
  whatsApp: "Usually replies within a few hours",
  email: "Reply within 24 hours",
} as const;

/** Languages the office replies in. */
export const REPLY_LANGUAGES = { text: "English and German", note: "[Confirm languages your team replies in]" } as const;

/** Short directions to the office, under the address. */
export const OFFICE_DIRECTIONS = "[Short directions, e.g. near ...]";

export type NextStep = { when: string; title: string; text: string };

export const NEXT_STEPS: readonly NextStep[] = [
  {
    when: "Today",
    title: "You send us a message",
    text: "Tell us your dates, group size and what you would like to see. Questions only are fine too.",
  },
  {
    when: "Within a few hours",
    title: "We reply with a plan and price",
    text: "A local expert suggests the right trek, a day-by-day itinerary and a clear price for your group.",
  },
  {
    when: "When you are ready",
    title: "Confirm with a 10% deposit",
    text: "We book permits, transport, guides and lodges. Change the plan for free until it is right.",
  },
];

export const CONTACT_FAQS: readonly { question: string; answer: string }[] = [
  {
    question: "How quickly do you reply?",
    answer: "On WhatsApp usually within a few hours during Nepal office hours, and by email within 24 hours.",
  },
  { question: "Does it cost anything to ask?", answer: "No. Questions, suggestions and itineraries are free, with no obligation to book." },
  {
    question: "Do you store my details?",
    answer:
      "This website does not store your message. It opens WhatsApp or your email app, and we only use your details to reply to you.",
  },
  {
    question: "Can we talk on a call?",
    answer: "Yes. Ask on WhatsApp and we will set up a voice or video call at a time that suits you.",
  },
  {
    question: "I am already in Kathmandu. Can I visit?",
    answer: "Of course. Drop by the office during opening hours, or message us and we will meet you.",
  },
];
