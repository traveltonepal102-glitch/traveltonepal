import { LegalPage } from "@/features/legal/components/LegalPage";
import { termsDoc } from "@/features/legal/content/terms";
import { legalMetadata } from "@/features/legal/seo";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";

export const generateMetadata = async () => legalMetadata(termsDoc(await getSiteSettings()));

const Terms = async () => (
  <main className="flex-1 bg-page">
    <LegalPage doc={termsDoc(await getSiteSettings())} />
  </main>
);

export default Terms;
