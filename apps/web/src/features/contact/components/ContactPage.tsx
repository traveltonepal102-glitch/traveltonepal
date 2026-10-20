import { JsonLd } from "@/components/shared/JsonLd";

import { contactJsonLd } from "../seo";
import { ContactFaq } from "./ContactFaq";
import { ContactHero } from "./ContactHero";
import { ContactWays } from "./ContactWays";
import { NextSteps } from "./NextSteps";
import { OfficeSection } from "./office/OfficeSection";
import { PlanSection } from "./plan/PlanSection";

/** Contact page (design: Contact.dc.html): ways to reach us, the message builder, next steps, office and FAQ. */
export const ContactPage = () => (
  <>
    <JsonLd data={contactJsonLd()} />
    <ContactHero />
    <ContactWays />
    <PlanSection />
    <NextSteps />
    <OfficeSection />
    <ContactFaq />
  </>
);
