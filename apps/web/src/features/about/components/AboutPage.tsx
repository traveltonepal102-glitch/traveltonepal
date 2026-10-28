import { JsonLd } from "@/components/shared/JsonLd";
import { PageSectionNav } from "@/components/shared/PageSectionNav";
import { listRegions } from "@/features/regions/services/regionsRepository";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";

import { aboutSectionLinks } from "../sections";
import { aboutJsonLd } from "../seo";
import { getAboutPage, listAboutTeam } from "../services/aboutRepository";
import { AboutCta } from "./AboutCta";
import { AboutHero } from "./AboutHero";
import type { AboutStat } from "./AboutHero";
import { BeliefsOverview } from "./beliefs/BeliefsOverview";
import { FlexibleSection } from "./beliefs/FlexibleSection";
import { HonestSection } from "./beliefs/HonestSection";
import { ListenSection } from "./beliefs/ListenSection";
import { OpenMindSection } from "./beliefs/OpenMindSection";
import { SafetyBand } from "./beliefs/SafetyBand";
import { LicencesSection } from "./LicencesSection";
import { ResponsibleSection } from "./ResponsibleSection";
import { StorySection } from "./story/StorySection";
import { TeamSection } from "./team/TeamSection";
import { VisitSection } from "./VisitSection";

/**
 * About us page (design: About.dc.html), from Pages › About: the four beliefs and the safety rule, the founder's
 * story, the team, licences, responsible travel and the office. The founded year and licences come from Site
 * settings, the region count from the regions; a section with nothing saved is left out.
 */
export const AboutPage = async () => {
  const [about, team, regions, { company }] = await Promise.all([getAboutPage(), listAboutTeam(), listRegions(), getSiteSettings()]);
  const stats: AboutStat[] = [
    ...(company.foundedYear ? [{ value: String(company.foundedYear), label: "Founded in Kathmandu" }] : []),
    ...(regions.length ? [{ value: String(regions.length), label: "Trekking regions" }] : []),
    ...(about.trekkersGuided ? [{ value: about.trekkersGuided, label: "Trekkers guided" }] : []),
    ...(about.stat ? [about.stat] : []),
  ];

  return (
    <>
      <JsonLd data={aboutJsonLd(about)} />
      <AboutHero top={about.top} stats={stats} />
      <BeliefsOverview listen={about.listen} honest={about.honest} flexible={about.flexible} openMind={about.openMind} safetyLine={about.safetyLine} />
      <PageSectionNav links={aboutSectionLinks({ hasTeam: team.length > 0 })} className="mt-12" />
      <ListenSection listen={about.listen} />
      <HonestSection honest={about.honest} />
      <FlexibleSection flexible={about.flexible} />
      <OpenMindSection openMind={about.openMind} />
      <SafetyBand safety={about.safety} />
      <StorySection story={about.story} founder={about.founder} />
      {team.length > 0 && <TeamSection team={team} heading={about.headings.team} />}
      <LicencesSection heading={about.headings.licences} />
      <ResponsibleSection />
      <VisitSection />
      <AboutCta />
    </>
  );
};
