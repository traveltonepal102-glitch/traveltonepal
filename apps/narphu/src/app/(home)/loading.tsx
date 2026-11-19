import { TrekPageSkeleton } from "@/features/trek-page/components/TrekPageSkeleton";

/** Shown at once when a link to the home page (the main trek's page) is clicked, until the page arrives. */
const HomeLoading = () => <TrekPageSkeleton variant="home" />;

export default HomeLoading;
