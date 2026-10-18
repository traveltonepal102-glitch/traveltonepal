import { GuidesPage } from "@/features/guides/components/GuidesPage";
import { guidesMetadata } from "@/features/guides/seo";

// TRD: list-page intros and their SEO are static in code.
export const metadata = guidesMetadata;

const TravelGuides = () => (
  <main className="flex-1 bg-page">
    <GuidesPage />
  </main>
);

export default TravelGuides;
