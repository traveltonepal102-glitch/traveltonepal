import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { saveSettings } from "@/features/settings/actions/saveSettings";
import { SettingsEditor } from "@/features/settings/components/SettingsEditor";
import { getSiteSettings } from "@/features/settings/services/settingsRepository";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { formatDateTime } from "@/utils/formatDateTime";

export const metadata: Metadata = { title: ADMIN_SECTIONS.settings.label };

/** Site settings: contact details, company and licences, social links (any admin sees them, a Super admin edits). */
const SettingsPage = async () => {
  const admin = await requireAdmin();
  const settings = await getSiteSettings();

  return (
    <SettingsEditor
      action={saveSettings}
      settings={settings}
      canEdit={admin.role === "super_admin"}
      lastSaved={`Saved ${formatDateTime(settings.updatedAt)} Nepal time`}
    />
  );
};

export default SettingsPage;
