import { GuidePageSkeleton } from "@/features/guide-article/components/GuidePageSkeleton";

/** Shown at once when a link to a travel guide is clicked, until the page arrives (see page.tsx). */
const GuideLoading = () => <GuidePageSkeleton />;

export default GuideLoading;
