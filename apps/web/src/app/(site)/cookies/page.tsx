import { CookieSettingsPanel } from "@/features/consent/components/CookieSettingsPanel";
import { LegalPage } from "@/features/legal/components/LegalPage";
import { legalMetadata } from "@/features/legal/seo";
import { getLegalDoc } from "@/features/legal/services/legalRepository";

export const generateMetadata = async () => legalMetadata(await getLegalDoc("cookies"));

const CookieSettings = async () => (
  <main className="flex-1 bg-page">
    <LegalPage doc={await getLegalDoc("cookies")}>
      <CookieSettingsPanel />
    </LegalPage>
  </main>
);

export default CookieSettings;
