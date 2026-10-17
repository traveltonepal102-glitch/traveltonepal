import { HelpBand } from "./HelpBand";
import { NotFoundHero } from "./NotFoundHero";
import { PopularTreksSection } from "./PopularTreksSection";
import { StartHereLinks } from "./StartHereLinks";

/** The 404 page body, without the header (the caller's layout decides whether it already has one). */
export const NotFoundContent = () => (
  <main className="flex-1">
    <NotFoundHero />
    <PopularTreksSection />
    <StartHereLinks />
    <HelpBand />
  </main>
);
