import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { saveSettings } from "@/features/settings/actions/saveSettings";
import { SettingsEditor } from "@/features/settings/components/SettingsEditor";
import { getSiteSettings } from "@/features/settings/services/settingsRepository";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { getCurrentSite } from "@/features/sites/lib/currentSite";
import { formatDateTime } from "@/utils/formatDateTime";

export const metadata: Metadata = { title: ADMIN_SECTIONS.settings.label };

/** The settings of the website "Working on" shows: contact details, company and licences, social links (any admin sees them, a Super admin edits). */
const SettingsPage = async () => {
  const admin = await requireAdmin();
  const site = await getCurrentSite();
  if (!site) notFound();
  const settings = await getSiteSettings(site.id);

  return (
    <SettingsEditor
      // A different website's settings are a different form: start it afresh.
      key={site.id}
      action={saveSettings.bind(null, site.id)}
      siteName={site.name}
      settings={settings}
      canEdit={admin.role === "super_admin"}
      lastSaved={`Saved ${formatDateTime(settings.updatedAt)} Nepal time`}
    />
  );
};

export default SettingsPage;
