"use client";

import { Icon } from "@ttn/ui/icon";
import { useId, useState } from "react";
import type { ChangeEvent } from "react";

import { ghostIconButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { FormSection } from "@/components/ui/FormSection";
import { inputClass, labelClass } from "@/components/ui/formStyles";

import { MAX_TREK_BLOG_POSTS } from "../../../constants";

type TrekBlogPostsCardProps = {
  /** The saved choices, in page order. */
  articleIds: string[];
  /** The website's published blog posts, A–Z. */
  options: { value: string; label: string }[];
  error?: string;
  onEdit: () => void;
};

/**
 * "Read before you go" on a region website's trek page: the blog posts it shows, in order, the first one large.
 * Sent as articleId; with none the website chooses (its featured post, then the newest). A post unpublished since drops out.
 */
export const TrekBlogPostsCard = ({ articleIds, options, error, onEdit }: TrekBlogPostsCardProps) => {
  const selectId = useId();
  const [picked, setPicked] = useState(() => articleIds.filter((id) => options.some((option) => option.value === id)));
  const pickedPosts = picked.flatMap((id) => options.filter((option) => option.value === id));
  const available = options.filter((option) => !picked.includes(option.value));

  const change = (next: string[]) => {
    setPicked(next);
    onEdit();
  };
  const handleAdd = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) change([...picked, event.target.value]);
  };
  /** Swaps a post with the one before it. */
  const moveUp = (index: number) => change(picked.map((id, at) => (at === index - 1 ? picked[index] : at === index ? picked[index - 1] : id)));

  return (
    <FormSection
      title="Blog posts on this trek’s page"
      hint={`In “Read before you go” near the end of this trek’s page. Pick up to ${MAX_TREK_BLOG_POSTS} in the order to show them: the first is the large card. The page shows only the posts you pick.`}
    >
      {pickedPosts.length > 0 && (
        <ol className="m-0 flex list-none flex-col gap-1.5 p-0">
          {pickedPosts.map((post, index) => (
            <li key={post.value} className="flex items-center gap-2.5 rounded-md border border-solid border-border bg-surface py-1.5 pr-1.5 pl-3">
              <input type="hidden" name="articleId" value={post.value} />
              <span className="w-5 flex-none text-xs font-bold text-subtle">{index + 1}</span>
              <span className="min-w-0 flex-1 font-bold text-ink">{post.label}</span>
              {index === 0 && <span className="rounded-full bg-page px-2.5 py-0.5 text-xs font-bold whitespace-nowrap text-muted-foreground max-tablet:hidden">Large card</span>}
              <div className="flex gap-0.5">
                <button type="button" className={ghostIconButton} aria-label={`Move ${post.label} up`} disabled={index === 0} onClick={() => moveUp(index)}>
                  <Icon name="arrow_upward" size={18} />
                </button>
                <button type="button" className={ghostIconButton} aria-label={`Move ${post.label} down`} disabled={index === pickedPosts.length - 1} onClick={() => moveUp(index + 1)}>
                  <Icon name="arrow_downward" size={18} />
                </button>
                <button type="button" className={ghostIconButton} aria-label={`Remove ${post.label}`} onClick={() => change(picked.filter((id) => id !== post.value))}>
                  <Icon name="close" size={18} />
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
      {!pickedPosts.length && (
        <p className="m-0 text-caption text-muted-foreground">
          {options.length ? "None picked: the website shows its featured post first, then the newest ones." : "No published blog posts yet: publish one in Travel guides first."}
        </p>
      )}

      {picked.length < MAX_TREK_BLOG_POSTS && available.length > 0 && (
        <div className="flex max-w-120 flex-col gap-1.5">
          <label htmlFor={selectId} className={labelClass}>
            Add a blog post
          </label>
          {/* Resets to the placeholder after each pick (value is always ""). */}
          <select id={selectId} value="" onChange={handleAdd} className={`${inputClass} cursor-pointer pr-8`}>
            <option value="">Pick a blog post…</option>
            {available.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
      <FieldError id="trek-blog-posts-error" message={error} />
    </FormSection>
  );
};
