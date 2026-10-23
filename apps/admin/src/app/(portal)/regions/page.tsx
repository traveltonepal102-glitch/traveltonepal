import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { SectionPlaceholder } from "@/features/shell/components/SectionPlaceholder";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";

const SECTION = ADMIN_SECTIONS.regions;

export const metadata: Metadata = { title: SECTION.label };

/** Placeholder until the screen is built (design: Admin-regions.dc.html). */
const RegionsPage = async () => {
  await requireAdmin();
  return <SectionPlaceholder section={SECTION} />;
};

export default RegionsPage;
