import { CookieSettingsPanel } from "@/features/consent/components/CookieSettingsPanel";
import { LegalPage } from "@/features/legal/components/LegalPage";
import { legalMetadata } from "@/features/legal/seo";
import { getLegalDoc } from "@/features/legal/services/legalRepository";
import { PageSchemasJsonLd } from "@/features/seo/PageSchemasJsonLd";
import { withSiteShareImage } from "@/features/seo/withSiteShareImage";

export const generateMetadata = async () => withSiteShareImage(legalMetadata(await getLegalDoc("cookies")));

const CookieSettings = async () => (
  <main className="flex-1 bg-page">
    <PageSchemasJsonLd kind="page" slug="cookies" />
    <LegalPage doc={await getLegalDoc("cookies")}>
      <CookieSettingsPanel />
    </LegalPage>
  </main>
);

export default CookieSettings;
