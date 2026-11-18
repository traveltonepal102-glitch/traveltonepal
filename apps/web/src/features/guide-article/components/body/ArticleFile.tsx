import { Icon } from "@ttn/ui/icon";
import { FILE_ICONS } from "@ttn/ui/lib/fileIcons";

import type { ArticleBlock } from "../../types";
import { FOCUS } from "../styles";

type ArticleFileProps = Omit<Extract<ArticleBlock, { type: "file" }>, "type">;

/**
 * "File to download": the file's icon (by its kind), title and description, and beside them (below on phones) the
 * button with its format and size under it. A file browsers can show (a PDF, a photo, a recording) opens in a new
 * tab to read or save; any other (Word, Excel, a ZIP…) is saved straight away.
 */
export const ArticleFile = ({ url, title, description, size, format, category, opensInBrowser }: ArticleFileProps) => (
  <section aria-label={title} className="flex flex-col gap-5 rounded-2xl border border-line bg-page p-5 sm:flex-row sm:items-center sm:gap-8 sm:p-6">
    <div className="flex min-w-0 flex-1 items-start gap-4">
      <span className={`inline-flex size-11 flex-none items-center justify-center rounded-lg ${category === "pdf" ? "bg-danger-tint text-danger" : "bg-brand-tint text-brand"}`}>
        <Icon name={FILE_ICONS[category]} size={24} />
      </span>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="font-display text-base leading-snug font-bold text-ink md:text-[17px]">{title}</p>
        {description && <p className="text-sm leading-normal text-muted-foreground">{description}</p>}
      </div>
    </div>
    <div className="flex flex-none flex-col items-stretch gap-1.5 sm:items-center">
      <a
        href={url}
        {...(opensInBrowser ? { target: "_blank", rel: "noopener noreferrer" } : { download: "" })}
        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-brand px-5 text-body-sm font-bold text-on-brand hover:bg-brand-hover ${FOCUS}`}
      >
        <Icon name="download" size={18} />
        Download {format}
        <span className="sr-only">
          : {title}
          {opensInBrowser && " (opens in a new tab)"}
        </span>
      </a>
      <span className="text-center text-xs text-muted-foreground">{size ? `${format} · ${size}` : format}</span>
    </div>
  </section>
);
