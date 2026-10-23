import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";

export const metadata: Metadata = { title: "Dashboard" };

/** Placeholder until the dashboard is built (design: Admin-dashboard.dc.html). */
const DashboardPage = async () => {
  const admin = await requireAdmin();
  const firstName = admin.full_name.split(" ")[0] || admin.email;

  return (
    <section className="mx-auto flex max-w-180 flex-col gap-2">
      <h1 className="m-0 font-display text-[30px] font-extrabold text-ink">Namaste, {firstName}</h1>
      <p className="m-0 text-[15px] text-muted-foreground">You are signed in. The dashboard comes next.</p>
    </section>
  );
};

export default DashboardPage;
