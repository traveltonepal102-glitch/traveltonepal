import { LegalPage } from "@/features/legal/components/LegalPage";
import { legalMetadata } from "@/features/legal/seo";
import { getLegalDoc } from "@/features/legal/services/legalRepository";

export const generateMetadata = () => legalMetadata("terms");

const Terms = async () => <LegalPage doc={await getLegalDoc("terms")} />;

export default Terms;
