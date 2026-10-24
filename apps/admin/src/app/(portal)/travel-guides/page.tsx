import type { Metadata } from "next";

import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { ArticlesOverview } from "@/features/travel-guides/components/list/ArticlesOverview";
import { listArticles, listAuthorOptions, listSiteOptions } from "@/features/travel-guides/services/articleOptions";
import { todayInNepal } from "@/utils/formatDateTime";

export const metadata: Metadata = { title: ADMIN_SECTIONS.travelGuides.label };

/** Travel guides list (the design has only the editor, Admin-article-editor.dc.html; the list follows Treks). */
const TravelGuidesPage = async () => {
  await requireAdmin();
  const [articles, sites, authors] = await Promise.all([listArticles(), listSiteOptions(), listAuthorOptions()]);

  return <ArticlesOverview articles={articles} sites={sites} authors={authors} today={todayInNepal()} />;
};

export default TravelGuidesPage;
