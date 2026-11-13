import { Suspense } from "react";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { JsonLd } from "@/components/shared/JsonLd";
import { ROUTES } from "@/lib/routes";

import { blogsJsonLd } from "../seo";
import { getBlogsPage } from "../services/blogsRepository";
import { BlogExplorer, BlogExplorerStatic } from "./BlogExplorer";

/**
 * One page of all blogs (`listPage`: 1 on /blogs, then /blogs/page/2…): the title band from Pages › Travel guides, then
 * search, topics and the page's blogs. Search and topics work in the browser from the address's query, which can't be
 * known when the page is built, hence the Suspense with the page as built.
 */
export const BlogsPage = async ({ listPage }: { listPage: number }) => {
  const page = await getBlogsPage();
  const { top, guides } = page;

  return (
    <main id="main">
      <JsonLd data={blogsJsonLd(page, listPage)} />
      <div className="border-0 border-b border-solid border-line bg-stone">
        <div className="wrap flex flex-col gap-3 pt-6 pb-10">
          <Breadcrumbs items={[{ label: "Home", href: ROUTES.home }, ...(listPage > 1 ? [{ label: "Blogs", href: ROUTES.blogs }, { label: `Page ${listPage}` }] : [{ label: "Blogs" }])]} />
          <h1>{top.heading}</h1>
          {top.intro && <p className="max-w-[62ch] text-[19px] leading-7.5">{top.intro}</p>}
        </div>
      </div>
      <Suspense fallback={<BlogExplorerStatic guides={guides} listPage={listPage} />}>
        <BlogExplorer guides={guides} listPage={listPage} />
      </Suspense>
    </main>
  );
};
