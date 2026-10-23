import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { SectionPlaceholder } from "@/features/shell/components/SectionPlaceholder";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";

const SECTION = ADMIN_SECTIONS.authors;

export const metadata: Metadata = { title: SECTION.label };

/** Placeholder until the screen is built (design: Admin-authors.dc.html). */
const AuthorsPage = async () => {
  await requireAdmin();
  return <SectionPlaceholder section={SECTION} />;
};

export default AuthorsPage;
