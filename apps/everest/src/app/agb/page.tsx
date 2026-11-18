import { LegalPage } from "@/features/legal/components/LegalPage";
import { legalMetadata } from "@/features/legal/seo";
import { getLegalDoc } from "@/features/legal/services/legalRepository";
import { PageSchemasJsonLd } from "@/features/site-pages/components/PageSchemasJsonLd";

export const generateMetadata = () => legalMetadata("terms");

const Terms = async () => (
  <>
    <LegalPage doc={await getLegalDoc("terms")} />
    <PageSchemasJsonLd pages={[{ kind: "page", slug: "terms" }]} />
  </>
);

export default Terms;
