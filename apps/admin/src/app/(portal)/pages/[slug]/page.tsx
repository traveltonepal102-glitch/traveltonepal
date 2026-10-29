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
import { EDITABLE_PAGES, LEGAL_PAGES, LEGAL_PAGES_ROUTE, LIST_PAGES, LIST_PAGES_ROUTE, isEditablePage } from "@/features/pages/constants";
import type { LegalPageSlug, ListPageSlug } from "@/features/pages/constants";
import { aboutFactsFrom } from "@/features/pages/lib/aboutFacts";
import { aboutTeamPeople } from "@/features/pages/lib/aboutTeamPeople";
import { toAboutValues } from "@/features/pages/lib/aboutContent";
import { toContactValues, toLegalValues } from "@/features/pages/lib/pageContent";
import { getSitePage, getSitePages } from "@/features/pages/services/pagesRepository";
import { listLibraryPhotos } from "@/features/photos/services/photosRepository";
import { listRegions } from "@/features/regions/services/regionsRepository";
import { getSiteSettings } from "@/features/settings/services/settingsRepository";
import { guidePath } from "@/features/trekking-guides/constants";
import { listTrekkingGuides } from "@/features/trekking-guides/services/guidesRepository";
import { formatDateTime } from "@/utils/formatDateTime";

export const generateMetadata = async ({ params }: PageProps<"/pages/[slug]">): Promise<Metadata> => {
  const { slug } = await params;
  if (slug === LIST_PAGES_ROUTE) return { title: "List pages" };
  if (slug === LEGAL_PAGES_ROUTE) return { title: "Legal pages" };
  return { title: EDITABLE_PAGES.find((page) => page.slug === slug)?.label ?? "Pages" };
};

const savedLabel = (updatedAt: string) => `Published · saved ${formatDateTime(updatedAt)} Nepal time`;

/** The list editor, open at ?page=<slug> (Home when missing or unknown). */
const ListPagesEditorPage = async (pageParam: unknown) => {
  const pages = await getSitePages(LIST_PAGES.map((page) => page.slug));
  const latest = pages.map((page) => page.updatedAt).sort().at(-1);
  const pageOf = (slug: ListPageSlug) => pages.find((page) => page.slug === slug);
  const topOf = (slug: ListPageSlug) => pageOf(slug)?.top;
  const sharePhotoOf = (slug: ListPageSlug) => pageOf(slug)?.sharePhoto ?? null;
  const [home, treks, regions, guides] = [topOf("home"), topOf("treks"), topOf("regions"), topOf("travel-guides")];
  if (!home || !treks || !regions || !guides || !latest) notFound();
  const initialPage = LIST_PAGES.find((page) => page.slug === pageParam)?.slug ?? "home";
  return (
    <ListPagesEditor
      action={saveListPages}
      values={{ home, treks, regions, "travel-guides": guides }}
      sharePhotos={{ home: sharePhotoOf("home"), treks: sharePhotoOf("treks"), regions: sharePhotoOf("regions"), "travel-guides": sharePhotoOf("travel-guides") }}
      initialPage={initialPage}
      websiteUrl={env.WEBSITE_URL ?? null}
      lastSaved={savedLabel(latest)}
    />
  );
};

/** The legal editor, open at ?page=<slug> (Terms when missing or unknown). */
const LegalPagesEditorPage = async (pageParam: unknown) => {
  const pages = await getSitePages(LEGAL_PAGES.map((page) => page.slug));
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
      action={saveLegalPages}
      values={{ terms, privacy, impressum, cookies }}
      initialPage={initialPage}
      websiteUrl={env.WEBSITE_URL ?? null}
      lastSaved={savedLabel(latest)}
    />
  );
};

/** One page's editor: /pages/about, /pages/contact, /pages/lists (the list pages) or /pages/legal (the legal pages). */
const SitePageEditorPage = async ({ params, searchParams }: PageProps<"/pages/[slug]">) => {
  await requireAdmin();
  const { slug } = await params;
  if (!isEditablePage(slug)) notFound();
  if (slug === LIST_PAGES_ROUTE) return ListPagesEditorPage((await searchParams).page);
  if (slug === LEGAL_PAGES_ROUTE) return LegalPagesEditorPage((await searchParams).page);

  const [page, libraryPhotos] = await Promise.all([getSitePage(slug), listLibraryPhotos()]);
  if (!page) notFound();
  const lastSaved = savedLabel(page.updatedAt);
  const websiteUrl = env.WEBSITE_URL ?? null;

  if (slug === "contact") {
    return <ContactPageEditor action={saveContactPage} values={toContactValues(page)} photo={page.photo} sharePhoto={page.sharePhoto} libraryPhotos={libraryPhotos} websiteUrl={websiteUrl} lastSaved={lastSaved} />;
  }

  const [authors, guides, settings, regions] = await Promise.all([listAuthors(), listTrekkingGuides(), getSiteSettings(), listRegions()]);
  return (
    <AboutPageEditor
      action={saveAboutPage}
      values={toAboutValues(page)}
      photo={page.photo}
      sharePhoto={page.sharePhoto}
      photoSlots={page.photoSlots}
      libraryPhotos={libraryPhotos}
      officeAuthors={authors.filter((author) => author.kind === "office").map((author) => ({ id: author.id, name: author.name, jobTitle: author.jobTitle }))}
      team={aboutTeamPeople(authors, guides, { authorHref: authorPath, guideHref: guidePath })}
      facts={aboutFactsFrom(settings, regions.length)}
      websiteUrl={websiteUrl}
      lastSaved={lastSaved}
    />
  );
};

export default SitePageEditorPage;
