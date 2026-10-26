import { LegalPage } from "@/features/legal/components/LegalPage";
import { privacyDoc } from "@/features/legal/content/privacy";
import { legalMetadata } from "@/features/legal/seo";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";

export const generateMetadata = async () => legalMetadata(privacyDoc(await getSiteSettings()));

const Privacy = async () => (
  <main className="flex-1 bg-page">
    <LegalPage doc={privacyDoc(await getSiteSettings())} />
  </main>
);

export default Privacy;
