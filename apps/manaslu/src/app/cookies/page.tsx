import { CookieSettingsPanel } from "@/features/consent/components/CookieSettingsPanel";
import { LegalPage } from "@/features/legal/components/LegalPage";
import { legalMetadata } from "@/features/legal/seo";
import { getLegalDoc } from "@/features/legal/services/legalRepository";
import { PageSchemasJsonLd } from "@/features/site-pages/components/PageSchemasJsonLd";

export const generateMetadata = () => legalMetadata("cookies");

const CookieSettings = async () => (
  <>
    <LegalPage doc={await getLegalDoc("cookies")}>
      <CookieSettingsPanel />
    </LegalPage>
    <PageSchemasJsonLd pages={[{ kind: "page", slug: "cookies" }]} />
  </>
);

export default CookieSettings;
