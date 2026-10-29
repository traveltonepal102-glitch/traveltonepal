import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import { summarizeContactClicks } from "../lib/contactClicks";
import type { ContactClicksSummary } from "../lib/contactClicks";

/** The website's WhatsApp and email clicks of the last `days` days (Nepal time). Throws when the database can't be read. */
export const getContactClicks = async (days: number): Promise<ContactClicksSummary> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("contact_click_totals", { p_days: days });
  if (error) throw new Error(`Could not load the button clicks: ${error.message}`);
  return summarizeContactClicks(data);
};
