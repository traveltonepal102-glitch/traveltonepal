import Image from "next/image";

import type { GuideArticle, GuideBlock } from "../../types";
import { PROSE } from "../styles";
import { ArticleTrekCard } from "./ArticleTrekCard";
import { LocalTip } from "./LocalTip";
import { MonthTable } from "./MonthTable";
import { SeasonStrip } from "./SeasonStrip";

type ArticleBlockProps = {
  block: GuideBlock;
  /** For blocks that show the article's trek or month ratings. */
  article: GuideArticle;
};

/** One piece of an article section. Blocks needing a trek or months the article doesn't have render nothing. */
export const ArticleBlock = ({ block, article }: ArticleBlockProps) => {
  switch (block.type) {
    case "paragraph":
      return <p className={PROSE}>{block.text}</p>;
    case "figure":
      return (
        <figure className="my-1">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-brand-tint">
            <Image src={block.image.src} alt={block.image.alt} fill sizes="(min-width: 1280px) 640px, (min-width: 1024px) 60vw, 100vw" className="object-cover" />
          </div>
          <figcaption className="mt-2 text-caption font-normal text-muted-foreground">{block.caption}</figcaption>
        </figure>
      );
    case "season-strip":
      return article.months ? <SeasonStrip months={article.months} /> : null;
    case "month-table":
      return article.months ? <MonthTable notes={block.months} ratings={article.months} /> : null;
    case "trek-card":
      return article.trek ? <ArticleTrekCard trek={article.trek} /> : null;
    case "tip":
      return <LocalTip title={block.title} text={block.text} />;
  }
};
