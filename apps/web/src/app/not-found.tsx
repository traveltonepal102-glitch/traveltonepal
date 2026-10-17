import type { Metadata } from "next";

import { HelpBand } from "@/features/not-found/components/HelpBand";
import { NotFoundHero } from "@/features/not-found/components/NotFoundHero";
import { PopularTreksSection } from "@/features/not-found/components/PopularTreksSection";
import { StartHereLinks } from "@/features/not-found/components/StartHereLinks";
import { SiteHeader } from "@/features/site-header/components/SiteHeader";

// Next.js answers with HTTP 404 and adds <meta name="robots" content="noindex"> itself (TRD: real 404, noindex).
export const metadata: Metadata = {
  title: "Page not found",
};

const NotFound = () => (
  <>
    <SiteHeader />
    <main className="flex-1">
      <NotFoundHero />
      <PopularTreksSection />
      <StartHereLinks />
      <HelpBand />
    </main>
  </>
);

export default NotFound;
