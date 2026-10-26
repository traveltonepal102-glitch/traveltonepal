import { LegalPage } from "@/features/legal/components/LegalPage";
import { legalMetadata } from "@/features/legal/seo";
import { getLegalDoc } from "@/features/legal/services/legalRepository";

export const generateMetadata = async () => legalMetadata(await getLegalDoc("privacy"));

const Privacy = async () => (
  <main className="flex-1 bg-page">
    <LegalPage doc={await getLegalDoc("privacy")} />
  </main>
);

export default Privacy;
