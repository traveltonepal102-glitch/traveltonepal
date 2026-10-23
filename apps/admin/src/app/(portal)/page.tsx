import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

/** Placeholder until the dashboard is built (design: Admin-dashboard.dc.html). */
const DashboardPage = () => (
  <section className="mx-auto flex max-w-180 flex-col gap-2">
    <h1 className="m-0 font-display text-[30px] font-extrabold text-ink">Namaste, [Admin name]</h1>
    <p className="m-0 text-[15px] text-muted-foreground">The dashboard comes next.</p>
  </section>
);

export default DashboardPage;
