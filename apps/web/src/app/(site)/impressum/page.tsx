import { LegalPage } from "@/features/legal/components/LegalPage";
import { impressumDoc } from "@/features/legal/content/impressum";
import { legalMetadata } from "@/features/legal/seo";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";

export const generateMetadata = async () => legalMetadata(impressumDoc(await getSiteSettings()));

const Impressum = async () => (
  <main className="flex-1 bg-page">
    <LegalPage doc={impressumDoc(await getSiteSettings())} />
  </main>
);

export default Impressum;
