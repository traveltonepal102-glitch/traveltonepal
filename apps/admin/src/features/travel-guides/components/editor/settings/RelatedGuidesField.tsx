"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId, useState } from "react";

import { ghostIconButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { inputClass, labelClass } from "@/components/ui/formStyles";

import { MAX_RELATED } from "../../../constants";
import type { ArticleOptions } from "../../../types";

type RelatedGuidesFieldProps = {
  initial: string[];
  /** The other travel guides. */
  articles: ArticleOptions["articles"];
  error?: string;
  onEdit: () => void;
};

/** "Related guides" (“Keep reading”): up to 3 picked by hand, in order, each sent as relatedId. */
export const RelatedGuidesField = ({ initial, articles, error, onEdit }: RelatedGuidesFieldProps) => {
  const id = useId();
  const [picked, setPicked] = useState(initial.filter((articleId) => articles.some((article) => article.id === articleId)));
  const titleOf = (articleId: string) => articles.find((article) => article.id === articleId)?.title ?? "";
  const change = (next: string[]) => {
    setPicked(next);
    onEdit();
  };

  return (
    <div className="flex flex-col gap-2">
      <span className={cn(labelClass, "flex items-center justify-between")}>
        Related guides <span className="text-xs font-semibold text-muted-foreground">“Keep reading”</span>
      </span>
      {picked.length > 0 && (
        <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
          {picked.map((articleId) => (
            <li key={articleId} className="flex items-center gap-2 rounded-lg border border-solid border-border bg-page py-1 pr-1 pl-3">
              <input type="hidden" name="relatedId" value={articleId} />
              <span className="min-w-0 flex-1 truncate text-caption font-semibold text-ink">{titleOf(articleId)}</span>
              <button type="button" className={ghostIconButton} aria-label={`Remove ${titleOf(articleId)}`} onClick={() => change(picked.filter((other) => other !== articleId))}>
                <Icon name="close" size={16} />
              </button>
            </li>
          ))}
        </ol>
      )}
      {picked.length < MAX_RELATED && (
        <>
          <label htmlFor={`${id}-add`} className="sr-only">
            Add a related guide
          </label>
          <select
            id={`${id}-add`}
            value=""
            onChange={(event) => event.target.value && change([...picked, event.target.value])}
            disabled={!articles.length}
            className={cn(inputClass, "cursor-pointer pr-8 text-caption")}
          >
            <option value="">{articles.length ? "Add a guide…" : "No other travel guides yet"}</option>
            {articles
              .filter((article) => !picked.includes(article.id))
              .map((article) => (
                <option key={article.id} value={article.id}>
                  {article.title}
                </option>
              ))}
          </select>
        </>
      )}
      <span className="text-xs text-muted-foreground">Picked by you. Leave empty and the site picks 3 from the same region and topic.</span>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
};
