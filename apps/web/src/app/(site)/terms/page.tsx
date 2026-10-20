import { LegalPage } from "@/features/legal/components/LegalPage";
import { TERMS } from "@/features/legal/content/terms";
import { legalMetadata } from "@/features/legal/seo";

export const metadata = legalMetadata(TERMS);

const Terms = () => (
  <main className="flex-1 bg-page">
    <LegalPage doc={TERMS} />
  </main>
);

export default Terms;
