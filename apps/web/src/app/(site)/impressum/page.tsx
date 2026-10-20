import { LegalPage } from "@/features/legal/components/LegalPage";
import { IMPRESSUM } from "@/features/legal/content/impressum";
import { legalMetadata } from "@/features/legal/seo";

export const metadata = legalMetadata(IMPRESSUM);

const Impressum = () => (
  <main className="flex-1 bg-page">
    <LegalPage doc={IMPRESSUM} />
  </main>
);

export default Impressum;
