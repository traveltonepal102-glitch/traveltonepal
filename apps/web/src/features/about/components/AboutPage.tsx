import { JsonLd } from "@/components/shared/JsonLd";
import { REGIONS } from "@/features/regions/regions";

import { TREKKERS_GUIDED } from "../aboutContent";
import { CREDENTIALS } from "../credentials";
import { aboutPageRating, aboutPageReviews } from "../reviews";
import { aboutSectionLinks } from "../sections";
import { aboutJsonLd } from "../seo";
import { AboutCta } from "./AboutCta";
import { AboutHero } from "./AboutHero";
import type { AboutStat } from "./AboutHero";
import { AboutReviews } from "./AboutReviews";
import { AboutSectionNav } from "./AboutSectionNav";
import { LicencesSection } from "./LicencesSection";
import { PromisesSection } from "./PromisesSection";
import { ResponsibleSection } from "./ResponsibleSection";
import { StorySection } from "./story/StorySection";
import { TeamSection } from "./team/TeamSection";
import { VisitSection } from "./VisitSection";

/** About us page (design: About.dc.html). Reviews and the rating stat only appear once there are real ones (placeholders in `pnpm dev`). */
export const AboutPage = () => {
  const reviews = aboutPageReviews();
  const rating = aboutPageRating();
  const stats: AboutStat[] = [
    { value: CREDENTIALS.foundedYear, label: "Founded in Kathmandu" },
    { value: String(REGIONS.length), label: "Trekking regions" },
    { value: TREKKERS_GUIDED, label: "Trekkers guided" },
    ...(rating ? [{ value: `${rating.ratingLabel} ★`, label: "Average review score" }] : []),
  ];

  return (
    <>
      <JsonLd data={aboutJsonLd()} />
      <AboutHero stats={stats} />
      <AboutSectionNav links={aboutSectionLinks({ hasReviews: reviews.length > 0 })} />
      <StorySection />
      <PromisesSection />
      <TeamSection />
      {reviews.length > 0 && <AboutReviews reviews={reviews} rating={rating} />}
      <LicencesSection />
      <ResponsibleSection />
      <VisitSection />
      <AboutCta />
    </>
  );
};
