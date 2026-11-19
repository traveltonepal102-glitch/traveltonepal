import { TrekPageSkeleton } from "@/features/trek-page/components/TrekPageSkeleton";

/** Shown at once when a link to a trek or a blog post is clicked, until the page arrives (see page.tsx). */
const SlugLoading = () => <TrekPageSkeleton variant="trek" />;

export default SlugLoading;
