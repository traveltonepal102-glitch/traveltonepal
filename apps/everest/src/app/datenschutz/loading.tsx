import { LegalPageSkeleton } from "@/features/legal/components/LegalPageSkeleton";

/** Shown at once when a link to the Datenschutzerklärung is clicked, until the page arrives. */
const LegalLoading = () => <LegalPageSkeleton page="datenschutz" />;

export default LegalLoading;
