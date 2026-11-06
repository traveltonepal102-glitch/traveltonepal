import { JsonLd } from "@/components/shared/JsonLd";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { GuideCard } from "@/features/home/components/GuideCard";

import { blogJsonLd } from "../seo";
import type { BlogArticle } from "../types";
import { BlogBlock } from "./blocks/BlogBlock";
import { BlogAuthor } from "./BlogAuthor";
import { BlogFacts } from "./BlogFacts";
import { BlogFeedback } from "./BlogFeedback";
import { BlogHeader } from "./BlogHeader";
import { BlogHelpBox, BlogTocFolded, PlanThisTrek } from "./BlogSideParts";
import { BlogToc } from "./BlogToc";

/**
 * One blog: the top on white with the photo under it, then the article beside a single rail ("On this page" and, unless
 * the blog turns them off, its trek and the help box). On a phone the contents fold above the article and the rest follows it.
 */
export const BlogArticlePage = ({ blog }: { blog: BlogArticle }) => {
  const { toc, showSidebar, trek, helpBox, title, related } = blog;
  const hasRail = toc.length > 0 || showSidebar;

  return (
    <main id="main">
      <JsonLd data={blogJsonLd(blog)} />
      <BlogHeader blog={blog} />
      <div className={`wrap grid items-start gap-x-14 gap-y-8 pt-10 pb-16 md:pb-20 ${hasRail ? "lg:grid-cols-[minmax(0,1fr)_340px]" : ""}`}>
        <article className={`flex min-w-0 flex-col gap-7 ${hasRail ? "" : "mx-auto w-full max-w-190"}`}>
          {toc.length > 0 && <BlogTocFolded links={toc} />}
          <BlogFacts facts={blog.facts} />
          {blog.blocks.map((block, index) => (
            <BlogBlock key={`${block.type}-${index}`} block={block} blog={blog} />
          ))}
          <BlogFeedback slug={blog.slug} />
          <BlogAuthor author={blog.author} checker={blog.checker} />
        </article>
        {hasRail && (
          <aside aria-label="About this blog" className="min-w-0 self-stretch">
            {/* Stays in view beside the article; on a screen too short for all of it, it scrolls by itself. On a phone it follows the article, and the contents are folded above it. */}
            <div className="flex flex-col gap-3 *:flex-none lg:sticky lg:top-6 lg:max-h-[calc(100dvh-48px)] lg:gap-5 lg:overflow-y-auto lg:[scrollbar-width:thin]">
              {toc.length > 0 && (
                <div className="hidden lg:block">
                  <BlogToc links={toc} />
                </div>
              )}
              {showSidebar && trek && <PlanThisTrek trek={trek} />}
              {showSidebar && <BlogHelpBox box={helpBox} blogTitle={title} />}
            </div>
          </aside>
        )}
      </div>
      {related.length > 0 && (
        <section aria-labelledby="keep-reading-h" className="bg-stone">
          <div className="wrap flex flex-col gap-7 py-14 md:py-18">
            <SectionHeading id="keep-reading-h" title="Keep reading" />
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
};
