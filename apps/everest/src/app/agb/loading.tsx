import { LegalPageSkeleton } from "@/features/legal/components/LegalPageSkeleton";

/** Shown at once when a link to the AGB is clicked, until the page arrives. */
const LegalLoading = () => <LegalPageSkeleton page="agb" />;

export default LegalLoading;
