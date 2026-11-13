import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { env } from "@/env";
import { authorPath } from "@/features/authors/constants";
import { listAuthors } from "@/features/authors/services/authorsRepository";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { saveAboutPage } from "@/features/pages/actions/saveAboutPage";
import { saveContactPage } from "@/features/pages/actions/saveContactPage";
import { saveLegalPages } from "@/features/pages/actions/saveLegalPages";
import { saveListPages } from "@/features/pages/actions/saveListPages";
import { AboutPageEditor } from "@/features/pages/components/about/AboutPageEditor";
import { ContactPageEditor } from "@/features/pages/components/contact/ContactPageEditor";
import { LegalPagesEditor } from "@/features/pages/components/legal/LegalPagesEditor";
import { ListPagesEditor } from "@/features/pages/components/ListPagesEditor";
import { EDITABLE_PAGES, LEGAL_PAGES, LEGAL_PAGES_ROUTE, LIST_PAGES_ROUTE, isEditablePage, listPagesFor } from "@/features/pages/constants";
import type { LegalPageSlug, ListPageSlug } from "@/features/pages/constants";
import { aboutFactsFrom } from "@/features/pages/lib/aboutFacts";
import { aboutTeamPeople } from "@/features/pages/lib/aboutTeamPeople";
import { toAboutValues } from "@/features/pages/lib/aboutContent";
import { toContactValues, toLegalValues } from "@/features/pages/lib/pageContent";
import { getSitePage, getSitePages } from "@/features/pages/services/pagesRepository";
import { listRegions } from "@/features/regions/services/regionsRepository";
import { getSiteSettings } from "@/features/settings/services/settingsRepository";
import { guidePath } from "@/features/trekking-guides/constants";
import { listTrekkingGuides } from "@/features/trekking-guides/services/guidesRepository";
import { getCurrentSite } from "@/features/sites/lib/currentSite";
import type { Site } from "@/features/sites/types";
import { formatDateTime } from "@/utils/formatDateTime";

export const generateMetadata = async ({ params }: PageProps<"/pages/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  if (slug === LIST_PAGES_ROUTE) return { title: "List pages" };
  if (slug === LEGAL_PAGES_ROUTE) return { title: "Legal pages" };
  return { title: EDITABLE_PAGES.find((page) => page.slug === slug)?.label ?? "Pages" };
};

const savedLabel = (updatedAt: string) => `Published · saved ${formatDateTime(updatedAt)} Nepal time`;

/** "View on site" opens the main website; a region website isn't built yet, so its pages have none. */
const viewOnSiteUrl = (site: Site) => (site.kind === "main" ? (env.WEBSITE_URL ?? null) : null);

/** The list editor, open at ?page=<slug> (its first page when missing or unknown). */
const ListPagesEditorPage = async (site: Site, pageParam: unknown) => {
  const listPages = listPagesFor(site.kind);
  const pages = await getSitePages(site.id, listPages.map((page) => page.slug));
  const latest = pages.map((page) => page.updatedAt).sort().at(-1);
  const pageOf = (slug: ListPageSlug) => pages.find((page) => page.slug === slug);
  // Every list page of the site has its row (made with the site); a missing one is a broken site.
  if (!latest || listPages.some((page) => !pageOf(page.slug))) notFound();
  const initialPage = listPages.find((page) => page.slug === pageParam)?.slug ?? listPages[0].slug;
  return (
    <ListPagesEditor
      action={saveListPages.bind(null, site.id)}
      pages={listPages}
      siteName={site.name}
      values={Object.fromEntries(listPages.map((page) => [page.slug, pageOf(page.slug)?.top]))}
      topPhotos={Object.fromEntries(listPages.map((page) => [page.slug, pageOf(page.slug)?.photo ?? null]))}
      sharePhotos={Object.fromEntries(listPages.map((page) => [page.slug, pageOf(page.slug)?.sharePhoto ?? null]))}
      initialPage={initialPage}
      websiteUrl={viewOnSiteUrl(site)}
      lastSaved={savedLabel(latest)}
    />
  );
};

/** The legal editor, open at ?page=<slug> (Terms when missing or unknown). */
const LegalPagesEditorPage = async (site: Site, pageParam: unknown) => {
  const pages = await getSitePages(site.id, LEGAL_PAGES.map((page) => page.slug));
  const latest = pages.map((page) => page.updatedAt).sort().at(-1);
  const valuesOf = (slug: LegalPageSlug) => {
    const page = pages.find((item) => item.slug === slug);
    return page ? toLegalValues(page) : undefined;
  };
  const [terms, privacy, impressum, cookies] = [valuesOf("terms"), valuesOf("privacy"), valuesOf("impressum"), valuesOf("cookies")];
  if (!terms || !privacy || !impressum || !cookies || !latest) notFound();
  const initialPage = LEGAL_PAGES.find((page) => page.slug === pageParam)?.slug ?? "terms";
  return (
    <LegalPagesEditor
      action={saveLegalPages.bind(null, site.id)}
      values={{ terms, privacy, impressum, cookies }}
      initialPage={initialPage}
      websiteUrl={viewOnSiteUrl(site)}
      lastSaved={savedLabel(latest)}
    />
  );
};

/** One page's editor: /pages/about, /pages/contact, /pages/lists (the list pages) or /pages/legal (the legal pages). */
const SitePageEditorPage = async ({ params, searchParams }: PageProps<"/pages/[slug]">) => {
  await requireAdmin();
  const [{ slug }, site] = await Promise.all([params, getCurrentSite()]);
  if (!isEditablePage(slug) || !site) notFound();
  if (slug === LIST_PAGES_ROUTE) return ListPagesEditorPage(site, (await searchParams).page);
  if (slug === LEGAL_PAGES_ROUTE) return LegalPagesEditorPage(site, (await searchParams).page);

  const page = await getSitePage(site.id, slug);
  if (!page) notFound();
  const lastSaved = savedLabel(page.updatedAt);
  const websiteUrl = viewOnSiteUrl(site);

  if (slug === "contact") {
    return <ContactPageEditor action={saveContactPage.bind(null, site.id)} values={toContactValues(page)} photo={page.photo} sharePhoto={page.sharePhoto} websiteUrl={websiteUrl} lastSaved={lastSaved} />;
  }

  // The website's own people: its founder is one of its office authors, its team its own authors and guides.
  const [authors, guides, settings, regions] = await Promise.all([listAuthors(site.id), listTrekkingGuides(site.id), getSiteSettings(site.id), site.kind === "main" ? listRegions() : null]);
  return (
    <AboutPageEditor
      action={saveAboutPage.bind(null, site.id)}
      values={toAboutValues(page)}
      photo={page.photo}
      sharePhoto={page.sharePhoto}
      photoSlots={page.photoSlots}
      officeAuthors={authors.filter((author) => author.kind === "office").map((author) => ({ id: author.id, name: author.name, jobTitle: author.jobTitle }))}
      team={aboutTeamPeople(authors, guides, { authorHref: authorPath, guideHref: guidePath })}
      facts={aboutFactsFrom(settings, regions?.length ?? null)}
      websiteUrl={websiteUrl}
      lastSaved={lastSaved}
    />
  );
};

export default SitePageEditorPage;
