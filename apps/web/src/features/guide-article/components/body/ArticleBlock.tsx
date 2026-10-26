import { RichText } from "@/components/shared/RichText";

import type { ArticleBlock as Block, GuideArticle } from "../../types";
import { PROSE, SECTION_TITLE } from "../styles";
import { ArticleFigure, ArticleGallery, ArticleMap } from "./ArticleMediaParts";
import { GuideTip, GuideWords, MeetGuides } from "./ArticlePeopleParts";
import { ArticleCallout, ArticleChecklist, ArticleCta, ArticlePullQuote } from "./ArticleTextParts";
import { ArticleTrekCard } from "./ArticleTrekCard";
import { ArticleCompare, ArticleCostTable, ArticleDays } from "./ArticleTrekParts";
import { MonthTable } from "./MonthTable";
import { SeasonStrip } from "./SeasonStrip";

type ArticleBlockProps = {
  block: Block;
  /** For blocks that show the article's months. */
  article: GuideArticle;
};

const BODY = `flex flex-col gap-4 ${PROSE}`;

/** One piece of the article body (the quick answer is shown on its own, at the top). */
export const ArticleBlock = ({ block, article }: ArticleBlockProps) => {
  switch (block.type) {
    case "quick":
      return null;
    case "paragraph":
      return <RichText doc={block.body} className={BODY} />;
    case "text":
      return (
        <section id={block.id} aria-labelledby={`${block.id}-title`} className="flex scroll-mt-5 flex-col gap-5 pt-3">
          <h2 id={`${block.id}-title`} className={SECTION_TITLE}>
            {block.heading}
          </h2>
          <RichText doc={block.body} className={BODY} />
        </section>
      );
    case "callout":
      return <ArticleCallout tone={block.tone} body={block.body} />;
    case "check":
      return <ArticleChecklist heading={block.heading} items={block.items} />;
    case "months":
      if (!article.months) return null;
      return (
        <section aria-label={block.heading || "Month by month"} className="flex flex-col gap-3">
          {block.heading && <h3 className="font-display text-lg font-bold text-ink">{block.heading}</h3>}
          {block.view === "strip" ? <SeasonStrip months={article.months.ratings} /> : <MonthTable notes={article.months.notes} ratings={article.months.ratings} />}
        </section>
      );
    case "cta":
      return <ArticleCta heading={block.heading} buttonText={block.buttonText} message={block.message} />;
    case "trek":
      return <ArticleTrekCard trek={block.trek} />;
    case "quote":
      return <ArticlePullQuote text={block.text} />;
    case "days":
      return <ArticleDays trek={block.trek} days={block.days} />;
    case "cost":
      return <ArticleCostTable heading={block.heading} rows={block.rows} totalLabel={block.totalLabel} total={block.total} />;
    case "compare":
      return <ArticleCompare treks={block.treks} />;
    case "tip":
      return <GuideTip guide={block.guide} text={block.text} />;
    case "gquote":
      return <GuideWords guide={block.guide} text={block.text} />;
    case "meet":
      return <MeetGuides heading={block.heading} guides={block.guides} />;
    case "image":
      return <ArticleFigure image={block.image} caption={block.caption} />;
    case "gallery":
      return <ArticleGallery images={block.images} />;
    case "map":
      return <ArticleMap title={block.title} place={block.place} />;
  }
};
