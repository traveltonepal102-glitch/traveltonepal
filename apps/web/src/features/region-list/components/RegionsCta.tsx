import { ContactCta } from "@/components/shared/ContactCta";

import { WRAP } from "./styles";

/** "Still deciding between regions?": free advice from a local expert on WhatsApp or by email. */
export const RegionsCta = () => (
  <section aria-labelledby="regions-cta-title" className="pb-14">
    <div className={WRAP}>
      <ContactCta
        titleId="regions-cta-title"
        title="Still deciding between regions?"
        text="Tell us your dates, fitness and what you want to see. A local expert suggests the right region and trek, free."
        message="Hello! I am deciding which region of Nepal to trek in. Could you suggest one for my dates and fitness?"
        emailSubject="Which region of Nepal should I trek in?"
        buttonLabel="Ask a local expert"
      />
    </div>
  </section>
);
