import { JsonLd } from "@/components/shared/JsonLd";

import { contactJsonLd } from "../seo";
import { getContactPage } from "../services/contactRepository";
import { ContactFaq } from "./ContactFaq";
import { ContactHero } from "./ContactHero";
import { ContactWays } from "./ContactWays";
import { NextSteps } from "./NextSteps";
import { OfficeSection } from "./office/OfficeSection";
import { PlanSection } from "./plan/PlanSection";

/**
 * Contact page (design: Contact.dc.html), from Pages › Contact (contact details from Site settings): ways to reach
 * us, the message builder, next steps, office and FAQ. A section with nothing in it is left out.
 */
export const ContactPage = async () => {
  const page = await getContactPage();
  return (
    <>
      <JsonLd data={contactJsonLd(page)} />
      <ContactHero top={page.top} />
      <ContactWays replyTimes={page.replyTimes} />
      <PlanSection />
      {page.nextSteps.length > 0 && <NextSteps steps={page.nextSteps} />}
      <OfficeSection page={page} />
      {page.faqs.length > 0 && <ContactFaq faqs={page.faqs} heading={page.faqHeading} />}
    </>
  );
};
