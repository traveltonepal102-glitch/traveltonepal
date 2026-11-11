import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { getCurrentSite } from "@/features/sites/lib/currentSite";
import { ArticlesOverview } from "@/features/travel-guides/components/list/ArticlesOverview";
import { listArticles, listAuthorOptions } from "@/features/travel-guides/services/articleOptions";
import { todayInNepal } from "@/utils/formatDateTime";

export const metadata: Metadata = { title: ADMIN_SECTIONS.travelGuides.label };

/** Travel guides list of the website "Working on" shows (the design has only the editor, Admin-article-editor.dc.html; the list follows Treks). */
const TravelGuidesPage = async () => {
  await requireAdmin();
  const site = await getCurrentSite();
  if (!site) notFound();
  const [articles, authors] = await Promise.all([listArticles(site.id), listAuthorOptions(site.id)]);

  return <ArticlesOverview siteName={site.name} articles={articles} authors={authors} today={todayInNepal()} />;
};

export default TravelGuidesPage;
