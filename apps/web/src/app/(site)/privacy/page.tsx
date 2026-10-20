import { LegalPage } from "@/features/legal/components/LegalPage";
import { PRIVACY } from "@/features/legal/content/privacy";
import { legalMetadata } from "@/features/legal/seo";

export const metadata = legalMetadata(PRIVACY);

const Privacy = () => (
  <main className="flex-1 bg-page">
    <LegalPage doc={PRIVACY} />
  </main>
);

export default Privacy;
