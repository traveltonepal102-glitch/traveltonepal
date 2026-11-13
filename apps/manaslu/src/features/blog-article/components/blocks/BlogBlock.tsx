import { FaqList } from "@/components/shared/FaqList";
import { RichText } from "@/components/shared/RichText";
import { CompareTreks } from "@/features/home/components/CompareTreks";

import { FAQ_ID, QUICK_ANSWER_ID } from "../../blogArticleRows";
import type { BlogArticle, BlogBlock as Block } from "../../types";
import { BlogCostTable, BlogTable } from "./BlogTableParts";
import { BlogEmbed } from "./BlogEmbed";
import { BlogHtml } from "./BlogHtml";
import { BlogFile, BlogGallery, BlogImage, BlogMap } from "./BlogMediaParts";
import { BlogMonths } from "./BlogMonths";
import { GuideQuote, GuideTip, MeetGuides } from "./BlogPeopleParts";
import { BlogCallout, BlogChecklist, BlogCta, BlogQuote } from "./BlogTextParts";
import { BlogAltitude, BlogDays, BlogTrekCard } from "./BlogTrekParts";
import { BlogVideo } from "./BlogVideo";

const BODY = "flex flex-col gap-4";
const H2 = "text-[28px]! leading-9! max-sm:text-2xl! max-sm:leading-8!";

/** One piece of the blog, where the admin put it. */
export const BlogBlock = ({ block, blog }: { block: Block; blog: BlogArticle }) => {
  switch (block.type) {
    case "quick":
      return (
        <section id={QUICK_ANSWER_ID} aria-labelledby="quick-answer-h" className="flex flex-col gap-2.5 rounded-2xl bg-forest-tint p-5 md:p-6">
          <h2 id="quick-answer-h" className="text-xl! leading-6.5! text-forest-deep!">
            Quick answer
          </h2>
          <RichText doc={block.body} className="flex flex-col gap-3 font-semibold text-ink" />
        </section>
      );
    case "faq":
      return (
        <section id={FAQ_ID} aria-labelledby="faq-h" className="flex flex-col gap-4">
          <h2 id="faq-h" className={H2}>
            Questions and answers
          </h2>
          <FaqList items={blog.faqs} />
        </section>
      );
    case "paragraph":
      return <RichText doc={block.body} className={BODY} />;
    case "text":
      return (
        <section id={block.id} aria-labelledby={`${block.id}-h`} className="flex flex-col gap-4 pt-2">
          <h2 id={`${block.id}-h`} className={H2}>
            {block.heading}
          </h2>
          <RichText doc={block.body} className={BODY} />
        </section>
      );
    case "heading":
      return block.level === "h2" ? (
        <h2 id={block.id} className={`${H2} pt-2`}>
          {block.heading}
        </h2>
      ) : (
        <h3 id={block.id}>{block.heading}</h3>
      );
    case "callout":
      return <BlogCallout tone={block.tone} body={block.body} />;
    case "check":
      return <BlogChecklist heading={block.heading} items={block.items} />;
    case "table":
      return <BlogTable heading={block.heading} header={block.header} rows={block.rows} footer={block.footer} hasRowHeadings={block.hasRowHeadings} />;
    case "html":
      return <BlogHtml html={block.html} />;
    case "months":
      return blog.months ? <BlogMonths heading={block.heading} view={block.view} months={blog.months} /> : null;
    case "cta":
      return <BlogCta heading={block.heading} buttonText={block.buttonText} message={block.message} />;
    case "trek":
      return <BlogTrekCard trek={block.trek} />;
    case "quote":
      return <BlogQuote text={block.text} />;
    case "days":
      return <BlogDays trek={block.trek} days={block.days} />;
    case "altitude":
      return <BlogAltitude heading={block.heading} trek={block.trek} days={block.days} />;
    case "cost":
      return <BlogCostTable heading={block.heading} rows={block.rows} totalLabel={block.totalLabel} total={block.total} />;
    case "compare":
      return <CompareTreks others={block.treks} />;
    case "tip":
      return <GuideTip guide={block.guide} text={block.text} />;
    case "gquote":
      return <GuideQuote guide={block.guide} text={block.text} />;
    case "meet":
      return <MeetGuides heading={block.heading} guides={block.guides} />;
    case "image":
      return <BlogImage image={block.image} caption={block.caption} />;
    case "gallery":
      return <BlogGallery images={block.images} />;
    case "map":
      return <BlogMap title={block.title} place={block.place} />;
    case "embed":
      return <BlogEmbed url={block.url} service={block.service} height={block.height} title={block.title} caption={block.caption} />;
    case "file":
      return <BlogFile url={block.url} title={block.title} description={block.description} size={block.size} />;
    case "video":
      return <BlogVideo youtubeId={block.youtubeId} title={block.title} />;
  }
};
