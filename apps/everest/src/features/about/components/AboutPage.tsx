import { JsonLd } from "@/components/shared/JsonLd";
import { PageSectionLinks } from "@/components/shared/PageSectionLinks";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";

import { ABOUT_SECTIONS } from "../sections";
import { aboutJsonLd } from "../seo";
import { getAboutContent, listTeam } from "../services/aboutRepository";
import { AboutHero } from "./AboutHero";
import type { AboutStat } from "./AboutHero";
import { BeliefsOverview } from "./BeliefsOverview";
import { FlexibleSection } from "./FlexibleSection";
import { HonestSection } from "./HonestSection";
import { LicencesSection } from "./LicencesSection";
import { ListenSection } from "./ListenSection";
import { OpenMindSection } from "./OpenMindSection";
import { ResponsibleSection } from "./ResponsibleSection";
import { SafetySection } from "./SafetySection";
import { StorySection } from "./StorySection";
import { TeamSection } from "./TeamSection";

/**
 * About us, from Pages › About: the title band, what we believe, the safety rule, the founder's story, the team, licences and
 * responsible travel, in plain sections on white and stone. A section with nothing saved is left out.
 */
export const AboutPage = async () => {
  const [about, team, { foundedYear }] = await Promise.all([getAboutContent(), listTeam(), getSiteSettings()]);
  const stats: AboutStat[] = [
    ...(foundedYear ? [{ value: String(foundedYear), label: "Gegründet" }] : []),
    ...(about.trekkingRegions ? [{ value: about.trekkingRegions, label: "Trekkingregionen" }] : []),
    ...(about.trekkersGuided ? [{ value: about.trekkersGuided, label: "Begleitete Trekker" }] : []),
    ...(about.stat ? [about.stat] : []),
  ];
  const links = [
    { id: ABOUT_SECTIONS.beliefs, label: "Unsere Werte" },
    { id: ABOUT_SECTIONS.story, label: "Unsere Geschichte" },
    ...(team.length > 0 ? [{ id: ABOUT_SECTIONS.team, label: "Unser Team" }] : []),
    { id: ABOUT_SECTIONS.licences, label: "Lizenzen" },
    { id: ABOUT_SECTIONS.responsible, label: "Verantwortungsvoll reisen" },
  ];

  return (
    <main id="main">
      <JsonLd data={aboutJsonLd(about)} />
      <AboutHero top={about.top} stats={stats} />
      <section aria-label="Abschnitte dieser Seite" className="sticky top-0 z-20 border-0 border-b border-solid border-line bg-white/97 backdrop-blur-sm">
        <div className="wrap">
          <PageSectionLinks links={links} />
        </div>
      </section>
      <BeliefsOverview listen={about.listen} honest={about.honest} flexible={about.flexible} openMind={about.openMind} safetyLine={about.safetyLine} />
      <ListenSection listen={about.listen} />
      <HonestSection honest={about.honest} />
      <FlexibleSection flexible={about.flexible} />
      <OpenMindSection openMind={about.openMind} />
      <SafetySection safety={about.safety} />
      <StorySection story={about.story} founder={about.founder} />
      {team.length > 0 && <TeamSection team={team} heading={about.headings.team} />}
      <LicencesSection heading={about.headings.licences} />
      <ResponsibleSection />
    </main>
  );
};
