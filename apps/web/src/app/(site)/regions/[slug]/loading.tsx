import { RegionPageSkeleton } from "@/features/region-detail/components/RegionPageSkeleton";

/** Shown at once when a link to a region is clicked, until the page arrives (see page.tsx). */
const RegionLoading = () => <RegionPageSkeleton />;

export default RegionLoading;
