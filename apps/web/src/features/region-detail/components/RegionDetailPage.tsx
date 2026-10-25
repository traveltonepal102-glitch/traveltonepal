import { JsonLd } from "@/components/shared/JsonLd";

import { regionJsonLd } from "../seo";
import type { RegionDetail } from "../types";
import { OtherRegions } from "./OtherRegions";
import { RegionBestTime } from "./RegionBestTime";
import { RegionCta } from "./RegionCta";
import { RegionFacts } from "./RegionFacts";
import { RegionFaq } from "./RegionFaq";
import { RegionGuides } from "./RegionGuides";
import { RegionHero } from "./RegionHero";
import { RegionOverview } from "./RegionOverview";
import { RegionPhotos } from "./RegionPhotos";
import { RegionSectionNav } from "./RegionSectionNav";
import type { RegionSectionLink } from "./RegionSectionNav";
import { RegionTravelGuides } from "./RegionTravelGuides";
import { RegionTreks } from "./RegionTreks";

/** "On this page" links; sections without content are left out (they do not render either). */
const sectionLinks = (region: RegionDetail): RegionSectionLink[] => [
  { id: "overview", label: "Overview" },
  { id: "treks", label: "Treks" },
  { id: "best-time", label: "Best time" },
  ...(region.guides.length > 0 ? [{ id: "guides", label: "Guides" }] : []),
  ...(region.photos.length > 0 ? [{ id: "photos", label: "Photos" }] : []),
  ...(region.articles.length > 0 ? [{ id: "travel-guides", label: "Travel guides" }] : []),
  ...(region.faqs.length > 0 ? [{ id: "faq", label: "Questions" }] : []),
];

/** Region page (design: Region.dc.html), from the region's content in the admin. */
export const RegionDetailPage = ({ region }: { region: RegionDetail }) => (
  <>
    <JsonLd data={regionJsonLd(region)} />
    <RegionHero region={region} />
    <RegionFacts region={region} />
    <RegionSectionNav links={sectionLinks(region)} />
    <RegionOverview region={region} />
    <RegionTreks region={region} />
    <RegionBestTime region={region} />
    <RegionGuides regionName={region.name} guides={region.guides} />
    <RegionPhotos regionName={region.name} photos={region.photos} />
    <RegionTravelGuides regionName={region.name} articles={region.articles} />
    <RegionFaq region={region} />
    <OtherRegions regions={region.compareWith} />
    <RegionCta regionName={region.name} />
  </>
);
