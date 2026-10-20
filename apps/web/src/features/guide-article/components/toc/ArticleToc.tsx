"use client";

import { Icon } from "@ttn/ui/icon";

import { formatReadTime } from "@/features/guides/format";
import { useActiveSection } from "@/hooks/useActiveSection";

import type { TocLink } from "../../guideArticles";
import { FOCUS } from "../styles";

type ArticleTocProps = {
  links: readonly TocLink[];
  readMinutes: number;
};

/** Sticky "In this guide" list (wide screens) that marks the section being read, plus reading time and Save as PDF. */
export const ArticleToc = ({ links, readMinutes }: ArticleTocProps) => {
  const activeId = useActiveSection(links.map((link) => link.id));

  return (
    <nav aria-labelledby="article-toc-title" className="sticky top-5 flex flex-col gap-0.5 print:hidden">
      <p id="article-toc-title" className="mb-2 text-xs font-bold tracking-widest text-muted-foreground uppercase">
        In this guide
      </p>
      {links.map((link) => {
        const isActive = link.id === activeId;
        return (
          <a
            key={link.id}
            href={`#${link.id}`}
            aria-current={isActive ? "location" : undefined}
            className={`block border-l-2 px-3 py-1.75 text-body-sm transition-colors ${FOCUS} ${
              isActive ? "border-brand font-bold text-brand" : "border-line font-medium text-text hover:text-brand"
            }`}
          >
            {link.label}
          </a>
        );
      })}

      <div className="mt-3.5 flex flex-col gap-1.5 border-t border-line pt-3.5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Icon name="schedule" size={14} />
          {formatReadTime(readMinutes)}
        </span>
        <button
          type="button"
          onClick={() => window.print()}
          className={`inline-flex cursor-pointer items-center gap-1.5 self-start rounded-sm font-semibold text-brand hover:underline ${FOCUS}`}
        >
          <Icon name="download" size={14} />
          Save as PDF
        </button>
      </div>
    </nav>
  );
};
