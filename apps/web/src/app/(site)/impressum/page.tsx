import { LegalPage } from "@/features/legal/components/LegalPage";
import { legalMetadata } from "@/features/legal/seo";
import { getLegalDoc } from "@/features/legal/services/legalRepository";

export const generateMetadata = async () => legalMetadata(await getLegalDoc("impressum"));

const Impressum = async () => (
  <main className="flex-1 bg-page">
    <LegalPage doc={await getLegalDoc("impressum")} />
  </main>
);

export default Impressum;
