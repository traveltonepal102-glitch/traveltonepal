import { RegionsPage } from "@/features/region-list/components/RegionsPage";
import { regionsMetadata } from "@/features/region-list/seo";

// TRD: list-page intros and their SEO are static in code.
export const metadata = regionsMetadata;

const Regions = () => (
  <main className="flex-1 bg-page">
    <RegionsPage />
  </main>
);

export default Regions;
