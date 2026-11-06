import { LegalPage } from "@/features/legal/components/LegalPage";
import { legalMetadata } from "@/features/legal/seo";
import { getLegalDoc } from "@/features/legal/services/legalRepository";

export const generateMetadata = () => legalMetadata("impressum");

const Impressum = async () => <LegalPage doc={await getLegalDoc("impressum")} />;

export default Impressum;
