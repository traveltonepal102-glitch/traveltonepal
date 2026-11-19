import { LegalPageSkeleton } from "@/features/legal/components/LegalPageSkeleton";

/** Shown at once when a link to the Cookie-Einstellungen is clicked, until the page arrives. */
const LegalLoading = () => <LegalPageSkeleton page="cookies" />;

export default LegalLoading;
