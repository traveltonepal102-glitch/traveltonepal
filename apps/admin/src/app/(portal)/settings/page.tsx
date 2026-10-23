import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { SectionPlaceholder } from "@/features/shell/components/SectionPlaceholder";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";

const SECTION = ADMIN_SECTIONS.settings;

export const metadata: Metadata = { title: SECTION.label };

/** Placeholder until the screen is built. */
const SettingsPage = async () => {
  await requireAdmin();
  return <SectionPlaceholder section={SECTION} />;
};

export default SettingsPage;
