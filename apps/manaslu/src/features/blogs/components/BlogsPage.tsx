import { Suspense } from "react";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { JsonLd } from "@/components/shared/JsonLd";
import { ROUTES } from "@/lib/routes";

import { blogsJsonLd } from "../seo";
import { getBlogsPage } from "../services/blogsRepository";
import { BlogExplorer, BlogExplorerStatic } from "./BlogExplorer";

/**
 * All blogs: the title band from Pages › Travel guides, then search, topics and pages. Search and pages work in the
 * browser from the address, so the page stays prerendered; the address can't be known at build time, hence the Suspense with page 1.
 */
export const BlogsPage = async () => {
  const page = await getBlogsPage();
  const { top, guides } = page;

  return (
    <main id="main">
      <JsonLd data={blogsJsonLd(page)} />
      <div className="border-0 border-b border-solid border-line bg-stone">
        <div className="wrap flex flex-col gap-3 pt-6 pb-10">
          <Breadcrumbs items={[{ label: "Home", href: ROUTES.home }, { label: "Blogs" }]} />
          <h1>{top.heading}</h1>
          {top.intro && <p className="max-w-[62ch] text-[19px] leading-7.5">{top.intro}</p>}
        </div>
      </div>
      <Suspense fallback={<BlogExplorerStatic guides={guides} />}>
        <BlogExplorer guides={guides} />
      </Suspense>
    </main>
  );
};
