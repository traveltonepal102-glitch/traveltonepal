import { LegalPage } from "@/features/legal/components/LegalPage";
import { legalMetadata } from "@/features/legal/seo";
import { getLegalDoc } from "@/features/legal/services/legalRepository";
import { PageSchemasJsonLd } from "@/features/site-pages/components/PageSchemasJsonLd";

export const generateMetadata = () => legalMetadata("impressum");

const Impressum = async () => (
  <>
    <LegalPage doc={await getLegalDoc("impressum")} />
    <PageSchemasJsonLd pages={[{ kind: "page", slug: "impressum" }]} />
  </>
);

export default Impressum;
