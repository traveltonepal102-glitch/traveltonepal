import { PageSectionHeading } from "@/components/shared/PageSectionHeading";
import { TREKS } from "@/features/treks/treks";

import { CONTACT_SECTION_IDS } from "../../sections";
import { CUSTOM_TREK, NOT_SURE_TREK } from "../../tripMessage";
import { WRAP } from "../styles";
import { TripMessageBuilder } from "./TripMessageBuilder";

/** Trek choices: "not sure" first, every trek, then a custom trek. Built here so the trek data stays off the browser. */
const TREK_OPTIONS = [NOT_SURE_TREK, ...TREKS.map((trek) => trek.name), CUSTOM_TREK];

/** "Tell us about your trip in 30 seconds": the message builder. */
export const PlanSection = () => (
  <section id={CONTACT_SECTION_IDS.plan} aria-labelledby="contact-plan-title" className="scroll-mt-4 pt-6 pb-12">
    <div className={`${WRAP} flex flex-col gap-5`}>
      <PageSectionHeading
        id="contact-plan-title"
        eyebrow="Save time"
        title="Tell us about your trip in 30 seconds"
        text="Fill in what you know. We write the message for you, then WhatsApp or your email app opens with it ready to send."
      />
      <TripMessageBuilder trekOptions={TREK_OPTIONS} />
    </div>
  </section>
);
