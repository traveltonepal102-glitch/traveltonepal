import { CookieSettingsPanel } from "@/features/consent/components/CookieSettingsPanel";
import { LegalPage } from "@/features/legal/components/LegalPage";
import { legalMetadata } from "@/features/legal/seo";
import { getLegalDoc } from "@/features/legal/services/legalRepository";

export const generateMetadata = () => legalMetadata("cookies");

const CookieSettings = async () => (
  <LegalPage doc={await getLegalDoc("cookies")}>
    <CookieSettingsPanel />
  </LegalPage>
);

export default CookieSettings;
