import { JsonLd } from "@/components/shared/JsonLd";
import type { TravelGuide } from "@/features/guides/types";

import { articleToc } from "../guideArticles";
import { pickRelatedGuides } from "../related";
import { articleJsonLd } from "../seo";
import type { GuideArticle } from "../types";
import { ArticleFacts } from "./ArticleFacts";
import { ArticleBody } from "./body/ArticleBody";
import { ArticleHero } from "./hero/ArticleHero";
import { RelatedGuides } from "./RelatedGuides";
import { PlanTrekCard } from "./sidebar/PlanTrekCard";
import { GuideHelpCard } from "./sidebar/GuideHelpCard";
import { WRAP } from "./styles";
import { ArticleToc } from "./toc/ArticleToc";

/**
 * Guide article (design: Guide-article.dc.html): photo hero, key facts, then contents list / article /
 * sidebar, then related guides (`guides`: the published ones, to pick them from). Three columns from 1280px, article and sidebar from 1024px (contents
 * folded into the article), one column below.
 */
export const GuideArticlePage = ({ article, guides }: { article: GuideArticle; guides: readonly TravelGuide[] }) => {
  const toc = articleToc(article);

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <ArticleHero article={article} />
      <ArticleFacts facts={article.facts} />

      <div className="bg-surface">
        <div className={`${WRAP} grid items-start gap-10 pt-9 pb-12 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[220px_minmax(0,1fr)_300px]`}>
          {/* Stretched to the row's height so the list inside can stay in view while the article scrolls. */}
          <div className="hidden self-stretch xl:block">
            <ArticleToc links={toc} readMinutes={article.readMinutes} />
          </div>
          <ArticleBody article={article} toc={toc} />
          <aside aria-label="Plan your trek" className="flex flex-col gap-4 lg:sticky lg:top-5 print:hidden">
            {article.trek && <PlanTrekCard trek={article.trek} guideTitle={article.title} />}
            <GuideHelpCard box={article.helpBox} guideTitle={article.title} />
          </aside>
        </div>
      </div>

      <RelatedGuides guides={pickRelatedGuides(article, guides)} />
    </>
  );
};
