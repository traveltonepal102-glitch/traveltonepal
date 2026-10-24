import type { Metadata } from "next";

import { saveAuthor } from "@/features/authors/actions/saveAuthor";
import { AuthorPanel } from "@/features/authors/components/editor/AuthorPanel";
import { AuthorsOverview } from "@/features/authors/components/list/AuthorsOverview";
import { EMPTY_AUTHOR_VALUES } from "@/features/authors/constants";
import { toAuthorGuide } from "@/features/authors/lib/authorGuides";
import { listAuthors } from "@/features/authors/services/authorsRepository";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { listTrekkingGuides } from "@/features/trekking-guides/services/guidesRepository";

export const metadata: Metadata = { title: ADMIN_SECTIONS.authors.label };

/**
 * Authors (design: Admin-authors.dc.html, the "Authors" tab of Admin-people). "?author=<id>" opens an author's
 * edit panel beside the list, "?author=new" an empty one; "&added=1" right after adding.
 */
const AuthorsPage = async ({ searchParams }: PageProps<"/authors">) => {
  const admin = await requireAdmin();
  const [authors, trekkingGuides, { author: openParam, added }] = await Promise.all([listAuthors(), listTrekkingGuides(), searchParams]);
  const guides = trekkingGuides.map(toAuthorGuide);

  const openId = typeof openParam === "string" ? openParam : null;
  const open = authors.find((author) => author.id === openId) ?? null;
  const isAdding = openId === "new";

  const panel = (open || isAdding) && (
    <AuthorPanel
      // A fresh form for each author (nothing typed for one author carries over to another).
      key={open?.id ?? "new"}
      action={saveAuthor.bind(null, open?.id ?? null)}
      author={open}
      values={open ?? EMPTY_AUTHOR_VALUES}
      guides={guides}
      takenGuideIds={authors.flatMap((author) => author.guideId ?? [])}
      canRemove={admin.role === "super_admin"}
      isJustAdded={added === "1"}
    />
  );

  return <AuthorsOverview authors={authors} guides={guides} openId={open?.id ?? (isAdding ? "new" : null)} panel={panel || null} />;
};

export default AuthorsPage;
