import { LegalPage } from "@/features/legal/components/LegalPage";
import { legalMetadata } from "@/features/legal/seo";
import { getLegalDoc } from "@/features/legal/services/legalRepository";
import { PageSchemasJsonLd } from "@/features/site-pages/components/PageSchemasJsonLd";

export const generateMetadata = () => legalMetadata("privacy");

const Privacy = async () => (
  <>
    <LegalPage doc={await getLegalDoc("privacy")} />
    <PageSchemasJsonLd pages={[{ kind: "page", slug: "privacy" }]} />
  </>
);

export default Privacy;
