import { JsonLd } from "@/components/shared/JsonLd";
import { WhatsAppCta } from "@/components/shared/WhatsAppCta";
import { NewsletterBand } from "@/features/newsletter/components/NewsletterBand";
import { REGIONS } from "@/features/regions/regions";

import { pickGuideHighlights, pickGuidesBySlug, regionsWithGuides } from "../guideLists";
import { guidesJsonLd } from "../seo";
import { START_HERE_SLUGS, TRAVEL_GUIDES } from "../travelGuides";
import { AllGuidesSection } from "./AllGuidesSection";
import { GuideHighlightsSection } from "./GuideHighlightsSection";
import { GuideRegionLinks } from "./GuideRegionLinks";
import { GuidesHero } from "./GuidesHero";
import { GuideTopicsSection } from "./GuideTopicsSection";
import { StartHereSection } from "./StartHereSection";
import { WRAP } from "./styles";

/**
 * Travel guides page: header with search, featured guides, topics, "Start here", every guide,
 * guides by region, a WhatsApp question box and the newsletter.
 */
export const GuidesPage = () => {
  const highlights = pickGuideHighlights(TRAVEL_GUIDES);
  const regions = regionsWithGuides(TRAVEL_GUIDES, REGIONS);

  return (
    <>
      <JsonLd data={guidesJsonLd(TRAVEL_GUIDES)} />
      <GuidesHero />
      {highlights && <GuideHighlightsSection {...highlights} />}
      <GuideTopicsSection guides={TRAVEL_GUIDES} />
      <StartHereSection guides={pickGuidesBySlug(TRAVEL_GUIDES, START_HERE_SLUGS)} />
      <AllGuidesSection guides={TRAVEL_GUIDES} regions={regions} />

      <div className={`${WRAP} flex flex-col gap-5 pb-12 md:pb-16`}>
        {regions.length > 0 && <GuideRegionLinks regions={regions} />}
        <section aria-labelledby="guides-question-title">
          <WhatsAppCta
            titleId="guides-question-title"
            title="Have a question our guides don't answer?"
            text="Ask a local expert on WhatsApp. We answer every question personally, free and with no obligation to book."
            message="Hello! I have a question about trekking in Nepal that your guides don't answer:"
            buttonLabel="Ask on WhatsApp"
          />
        </section>
      </div>

      {/* The band renders nothing until an email provider is connected; empty:hidden drops the spacing too. */}
      <div className={`${WRAP} pb-12 empty:hidden md:pb-16`}>
        <NewsletterBand badge="Free Nepal packing checklist" />
      </div>
    </>
  );
};
