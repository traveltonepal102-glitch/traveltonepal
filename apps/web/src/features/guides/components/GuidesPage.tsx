import { JsonLd } from "@/components/shared/JsonLd";
import { WhatsAppCta } from "@/components/shared/WhatsAppCta";
import { NewsletterBand } from "@/features/newsletter/components/NewsletterBand";
import { REGIONS } from "@/features/regions/regions";
import type { SitePageTop } from "@/features/site-pages/types";

import { pickGuideHighlights, regionsWithGuides } from "../guideLists";
import { startHereGuides } from "../guideRows";
import { guidesJsonLd } from "../seo";
import type { TravelGuide } from "../types";
import { AllGuidesSection } from "./AllGuidesSection";
import { GuideHighlightsSection } from "./GuideHighlightsSection";
import { GuideRegionLinks } from "./GuideRegionLinks";
import { GuidesHero } from "./GuidesHero";
import { GuideTopicsSection } from "./GuideTopicsSection";
import { StartHereSection } from "./StartHereSection";
import { WRAP } from "./styles";

/**
 * Travel guides page: header with search, featured guides, topics, "Start here", every guide,
 * guides by region, a WhatsApp question box and the newsletter. `guides`: the published ones (guidesRepository).
 */
export const GuidesPage = ({ top, guides }: { top: SitePageTop; guides: readonly TravelGuide[] }) => {
  const highlights = pickGuideHighlights(guides);
  const regions = regionsWithGuides(guides, REGIONS);

  return (
    <>
      <JsonLd data={guidesJsonLd(guides)} />
      <GuidesHero top={top} />
      {highlights && <GuideHighlightsSection {...highlights} />}
      <GuideTopicsSection guides={guides} />
      <StartHereSection guides={startHereGuides(guides)} />
      <AllGuidesSection guides={guides} regions={regions} />

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
