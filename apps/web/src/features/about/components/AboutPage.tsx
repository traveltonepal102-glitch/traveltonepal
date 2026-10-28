import { JsonLd } from "@/components/shared/JsonLd";
import { listRegions } from "@/features/regions/services/regionsRepository";
import { getPublishedReviews } from "@/features/reviews/services/reviewsRepository";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";

import { aboutPageRating, aboutPageReviews } from "../reviews";
import { aboutSectionLinks } from "../sections";
import { aboutJsonLd } from "../seo";
import { getAboutPage, listAboutTeam } from "../services/aboutRepository";
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

/**
 * About us page (design: About.dc.html), from Pages › About; the founded year and licences come from Site settings,
 * the region count from the regions. Reviews and the rating stat only appear once there are real ones (placeholders
 * in `pnpm dev`).
 */
export const AboutPage = async () => {
  const [about, team, regions, { company }, published] = await Promise.all([
    getAboutPage(),
    listAboutTeam(),
    listRegions(),
    getSiteSettings(),
    getPublishedReviews(),
  ]);
  const reviews = aboutPageReviews(published);
  const rating = aboutPageRating(published);
  const stats: AboutStat[] = [
    ...(company.foundedYear ? [{ value: String(company.foundedYear), label: "Founded in Kathmandu" }] : []),
    ...(regions.length ? [{ value: String(regions.length), label: "Trekking regions" }] : []),
    ...(about.trekkersGuided ? [{ value: about.trekkersGuided, label: "Trekkers guided" }] : []),
    ...(rating ? [{ value: `${rating.ratingLabel} ★`, label: "Average review score" }] : []),
  ];

  return (
    <>
      <JsonLd data={aboutJsonLd(about)} />
      <AboutHero top={about.top} stats={stats} />
      <AboutSectionNav links={aboutSectionLinks({ hasReviews: reviews.length > 0, hasPromises: about.promises.length > 0, hasTeam: team.length > 0 })} />
      <StorySection story={about.story} founder={about.founder} milestones={about.milestones} />
      {about.promises.length > 0 && <PromisesSection promises={about.promises} heading={about.headings.promises} />}
      {team.length > 0 && <TeamSection team={team} heading={about.headings.team} />}
      {reviews.length > 0 && <AboutReviews reviews={reviews} rating={rating} heading={about.headings.reviews.title} />}
      <LicencesSection heading={about.headings.licences} />
      <ResponsibleSection />
      <VisitSection />
      <AboutCta />
    </>
  );
};
