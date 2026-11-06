import { LegalPage } from "@/features/legal/components/LegalPage";
import { legalMetadata } from "@/features/legal/seo";
import { getLegalDoc } from "@/features/legal/services/legalRepository";

export const generateMetadata = () => legalMetadata("privacy");

const Privacy = async () => <LegalPage doc={await getLegalDoc("privacy")} />;

export default Privacy;
