import { LegalPage } from "@/features/legal/components/LegalPage";
import { legalMetadata } from "@/features/legal/seo";
import { getLegalDoc } from "@/features/legal/services/legalRepository";
import { PageSchemasJsonLd } from "@/features/seo/PageSchemasJsonLd";
import { withSiteShareImage } from "@/features/seo/withSiteShareImage";

export const generateMetadata = async () => withSiteShareImage(legalMetadata(await getLegalDoc("terms")));

const Terms = async () => (
  <main className="flex-1 bg-page">
    <PageSchemasJsonLd kind="page" slug="terms" />
    <LegalPage doc={await getLegalDoc("terms")} />
  </main>
);

export default Terms;
