import { LegalPageSkeleton } from "@/features/legal/components/LegalPageSkeleton";

/** Shown at once when a link to the Impressum is clicked, until the page arrives. */
const LegalLoading = () => <LegalPageSkeleton page="impressum" />;

export default LegalLoading;
