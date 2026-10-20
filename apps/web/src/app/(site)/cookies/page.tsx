import { CookieSettingsPanel } from "@/features/consent/components/CookieSettingsPanel";
import { LegalPage } from "@/features/legal/components/LegalPage";
import { COOKIES } from "@/features/legal/content/cookies";
import { legalMetadata } from "@/features/legal/seo";

export const metadata = legalMetadata(COOKIES);

const CookieSettings = () => (
  <main className="flex-1 bg-page">
    <LegalPage doc={COOKIES}>
      <CookieSettingsPanel />
    </LegalPage>
  </main>
);

export default CookieSettings;
