import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { DeparturesOverview } from "@/features/departures/components/DeparturesOverview";
import { listDepartureTreks, listDepartures } from "@/features/departures/services/departuresRepository";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { todayInNepal } from "@/utils/formatDateTime";

export const metadata: Metadata = { title: ADMIN_SECTIONS.departures.label };

/** Departure dates (design: Admin-departures.dc.html, -add, -repeat): every fixed date on every trek. "?add=1" opens "Add date". */
const DeparturesPage = async ({ searchParams }: PageProps<"/departures">) => {
  await requireAdmin();
  const [departures, treks, { add }] = await Promise.all([listDepartures(), listDepartureTreks(), searchParams]);

  return <DeparturesOverview departures={departures} treks={treks} today={todayInNepal()} isAdding={add === "1"} />;
};

export default DeparturesPage;
