import { LegalPage } from "@/features/legal/components/LegalPage";
import { legalMetadata } from "@/features/legal/seo";
import { getLegalDoc } from "@/features/legal/services/legalRepository";
import { PageSchemasJsonLd } from "@/features/seo/PageSchemasJsonLd";

export const generateMetadata = async () => legalMetadata(await getLegalDoc("terms"));

const Terms = async () => (
  <main className="flex-1 bg-page">
    <PageSchemasJsonLd kind="page" slug="terms" />
    <LegalPage doc={await getLegalDoc("terms")} />
  </main>
);

export default Terms;
