import { Icon } from "@ttn/ui/icon";

import { formatReadTime } from "@/features/guides/format";
import { guidePath } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

import type { GuideArticle } from "../../types";
import { ShareButtons } from "./ShareButtons";

/** Author (photo placeholder, name, role), reading time, season note and share buttons, under the hero title. */
export const ArticleByline = ({ article }: { article: GuideArticle }) => (
  <div className="mt-1.5 flex flex-col gap-4 border-t border-white/20 pt-5 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-3.5">
      <span aria-hidden="true" className="inline-flex size-12.5 flex-none items-center justify-center rounded-full bg-saffron text-ink">
        <Icon name="person" size={26} />
      </span>
      <span className="flex flex-col leading-snug">
        <span className="inline-flex items-center gap-1.5 font-display text-lg font-bold">
          {article.author}
          <Icon name="verified" size={18} label="Verified author" className="text-whatsapp-on-dark" />
        </span>
        <span className="text-body-sm text-navy-text">{article.authorRole}</span>
      </span>
    </div>

    <div className="flex flex-wrap items-center gap-x-5.5 gap-y-2.5 text-body-sm font-semibold tracking-[0.04em] text-white/85 uppercase">
      <span className="inline-flex items-center gap-2">
        <Icon name="schedule" size={18} className="text-saffron" />
        {formatReadTime(article.readMinutes)}
      </span>
      <span className="inline-flex items-center gap-2">
        <Icon name="verified" size={18} className="text-whatsapp-on-dark" />
        Updated for the {article.updatedForSeason} season
      </span>
      <ShareButtons url={absoluteUrl(guidePath(article.slug))} title={article.title} />
    </div>
  </div>
);
