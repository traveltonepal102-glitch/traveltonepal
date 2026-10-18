import { IS_GUIDE_FEEDBACK_OPEN } from "../../feedback/service";
import type { TocLink } from "../../guideArticles";
import type { GuideArticle } from "../../types";
import { MobileToc } from "../toc/MobileToc";
import { PROSE, SECTION_TITLE } from "../styles";
import { ArticleBlock } from "./ArticleBlock";
import { ArticleFaq } from "./ArticleFaq";
import { AuthorBox } from "./AuthorBox";
import { GuideFeedback } from "./GuideFeedback";
import { QuickAnswer } from "./QuickAnswer";

type ArticleBodyProps = {
  article: GuideArticle;
  toc: readonly TocLink[];
};

/**
 * The article: quick answer, intro, each section's blocks, FAQ, author and "Was this guide helpful?".
 * Sections carry the contents list's ids.
 */
export const ArticleBody = ({ article, toc }: ArticleBodyProps) => (
  <article className="flex min-w-0 flex-col gap-5">
    <MobileToc links={toc} />
    <QuickAnswer text={article.quickAnswer} />
    {article.intro.map((paragraph) => (
      <p key={paragraph} className={PROSE}>
        {paragraph}
      </p>
    ))}

    {article.sections.map((section) => (
      <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="flex scroll-mt-5 flex-col gap-5 pt-3">
        <h2 id={`${section.id}-title`} className={SECTION_TITLE}>
          {section.title}
        </h2>
        {section.blocks.map((block, index) => (
          <ArticleBlock key={`${block.type}-${index}`} block={block} article={article} />
        ))}
      </section>
    ))}

    <ArticleFaq faqs={article.faqs} />
    <AuthorBox name={article.author} bio={article.authorBio} />
    {IS_GUIDE_FEEDBACK_OPEN && <GuideFeedback slug={article.slug} />}
  </article>
);
