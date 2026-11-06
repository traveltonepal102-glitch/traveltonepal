import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { FaqList } from "@/components/shared/FaqList";
import { JsonLd } from "@/components/shared/JsonLd";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getHomeData } from "@/features/home/services/homeRepository";
import { ROUTES } from "@/lib/routes";

import { CONTACT_SECTIONS } from "../sections";
import { contactJsonLd } from "../seo";
import { getContactPage } from "../services/contactRepository";
import { ContactDetails } from "./ContactDetails";
import { ContactForm } from "./ContactForm";
import { NextSteps } from "./NextSteps";
import { OfficeSection } from "./OfficeSection";

/**
 * Contact, from Pages › Contact (details from Site settings): the title, the contact form beside the ways to reach us,
 * what happens next, the office and the questions. A section with nothing in it is left out.
 */
export const ContactPage = async () => {
  const [page, { trekCard, otherTreks }] = await Promise.all([getContactPage(), getHomeData()]);
  const trekNames = [...(trekCard ? [trekCard.name] : []), ...otherTreks.map((trek) => trek.name)];

  return (
    <main id="main">
      <JsonLd data={contactJsonLd(page)} />
      <div className="border-0 border-b border-solid border-line bg-stone">
        <div className="wrap flex flex-col gap-3 pt-6 pb-10">
          <Breadcrumbs items={[{ label: "Home", href: ROUTES.home }, { label: "Contact" }]} />
          <h1>{page.top.heading}</h1>
          {page.top.intro && <p className="max-w-[62ch] text-[19px] leading-7.5">{page.top.intro}</p>}
        </div>
      </div>
      <div id={CONTACT_SECTIONS.plan} className="wrap grid gap-8 py-10 md:py-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <ContactForm trekNames={trekNames} />
        <ContactDetails replyTimes={page.replyTimes} />
      </div>
      {page.nextSteps.length > 0 && <NextSteps steps={page.nextSteps} />}
      <OfficeSection page={page} />
      {page.faqs.length > 0 && (
        <section id={CONTACT_SECTIONS.faq} aria-labelledby="contact-faq-h" className="wrap flex max-w-200 flex-col gap-6 py-14 md:py-18">
          <SectionHeading id="contact-faq-h" title={page.faqHeading || "Before you get in touch"} />
          <FaqList items={page.faqs.map((faq) => ({ question: faq.question, body: faq.answer }))} />
        </section>
      )}
    </main>
  );
};
