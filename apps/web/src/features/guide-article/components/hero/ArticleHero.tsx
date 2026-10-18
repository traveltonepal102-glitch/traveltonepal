import Image from "next/image";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { getGuideTopic } from "@/features/guides/topics";
import { formatAltitude } from "@/features/treks/format";

import { articleBreadcrumbs } from "../../seo";
import type { GuideArticle } from "../../types";
import { WRAP } from "../styles";
import { ArticleByline } from "./ArticleByline";

const CHIP = "rounded-md px-3.5 py-1.5 text-[13px] font-bold tracking-[0.06em] uppercase";
const GLASS_CHIP = `${CHIP} border border-white/30 bg-white/12`;

/** Photo hero: breadcrumb, chips (trek, topic, altitude, best months), title, intro and byline. */
export const ArticleHero = ({ article }: { article: GuideArticle }) => (
  <header className="relative overflow-hidden bg-navy text-white">
    <Image src={article.image.src} alt={article.image.alt} fill preload sizes="100vw" className="object-cover object-[50%_35%]" />
    {/* Dark at the bottom, where the text sits, even over bright snow; a softer shade at the top for the breadcrumb. */}
    <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-navy/97 via-navy/72 via-45% to-navy/25" />
    <div aria-hidden="true" className="absolute inset-x-0 top-0 h-28 bg-linear-to-b from-navy/60 to-transparent" />

    <div className={`${WRAP} relative flex min-h-125 flex-col justify-between gap-10 pt-5 pb-9 md:min-h-150`}>
      <Breadcrumbs tone="onDark" items={articleBreadcrumbs(article)} />

      <div className="flex flex-col gap-4.5">
        <ul className="flex flex-wrap gap-2.5">
          {article.trek && <li className={`${CHIP} bg-saffron font-extrabold text-ink`}>{article.trek.name}</li>}
          <li className={GLASS_CHIP}>{getGuideTopic(article.topic).label}</li>
          {article.trek && <li className={GLASS_CHIP}>Max {formatAltitude(article.trek.maxAltitudeM)}</li>}
          {article.bestMonths && (
            <li className={`${CHIP} inline-flex items-center gap-2 bg-whatsapp`}>
              <span aria-hidden="true" className="size-1.75 rounded-full bg-white" />
              Best: {article.bestMonths}
            </li>
          )}
        </ul>
        <h1 className="max-w-250 text-h1-sm tracking-tight text-white md:text-display">{article.title}</h1>
        <p className="max-w-195 text-body-lg text-white/85 md:text-xl md:leading-[1.55]">{article.standfirst}</p>
        <ArticleByline article={article} />
      </div>
    </div>
  </header>
);
