import { GuidesPage } from "@/features/guides/components/GuidesPage";
import { guidesMetadata } from "@/features/guides/seo";
import { listTravelGuides } from "@/features/guides/services/guidesRepository";

// TRD: list-page intros and their SEO are static in code (they move to the admin's Pages next).
export const metadata = guidesMetadata;

const TravelGuides = async () => {
  const guides = await listTravelGuides();
  return (
    <main className="flex-1 bg-page">
      <GuidesPage guides={guides} />
    </main>
  );
};

export default TravelGuides;
