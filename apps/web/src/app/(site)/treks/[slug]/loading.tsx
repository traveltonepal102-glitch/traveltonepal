import { TrekPageSkeleton } from "@/features/trek-detail/components/TrekPageSkeleton";

/** Shown at once when a link to a trek is clicked, until the page arrives (see page.tsx). */
const TrekLoading = () => <TrekPageSkeleton />;

export default TrekLoading;
