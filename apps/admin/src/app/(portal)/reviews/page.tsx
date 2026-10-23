import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { SectionPlaceholder } from "@/features/shell/components/SectionPlaceholder";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";

const SECTION = ADMIN_SECTIONS.reviews;

export const metadata: Metadata = { title: SECTION.label };

/** Placeholder until the screen is built. */
const ReviewsPage = async () => {
  await requireAdmin();
  return <SectionPlaceholder section={SECTION} />;
};

export default ReviewsPage;
