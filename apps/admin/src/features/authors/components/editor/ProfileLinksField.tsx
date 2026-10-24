"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { FormGroup } from "@/components/editor/FormGroup";
import { ghostIconButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { inputClass } from "@/components/ui/formStyles";
import { useRowList } from "@/hooks/useRowList";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { AUTHOR_LIMITS as LIMIT, MAX_PROFILE_LINKS } from "../../constants";

type ProfileLinksFieldProps = {
  /** Saved links; the first is the main one. */
  links: string[];
  errors: FieldErrors;
  onEdit: () => void;
};

/**
 * "Profile links for Google": each is sent as profileLink, and the main one's row number as mainLink (it is
 * stored first). None are shown on the article.
 */
export const ProfileLinksField = ({ links, errors, onEdit }: ProfileLinksFieldProps) => {
  const list = useRowList(links.length ? links.map((url) => ({ url })) : [{ url: "" }], onEdit);
  const [mainKey, setMainKey] = useState(list.rows[0]?.key ?? "");
  const main = list.rows.some((row) => row.key === mainKey) ? mainKey : list.rows[0]?.key;

  return (
    <FormGroup title="Profile links for Google">
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {list.rows.map((row, index) => {
          const isMain = row.key === main;
          return (
            <li key={row.key} className="flex items-center gap-2">
              <input
                type="radio"
                name="mainLink"
                value={index}
                checked={isMain}
                onChange={() => {
                  setMainKey(row.key);
                  onEdit();
                }}
                aria-label={`Main link: link ${index + 1}`}
                className="size-4.5 flex-none accent-brand"
              />
              <input
                name="profileLink"
                inputMode="url"
                aria-label={`Profile link ${index + 1}`}
                defaultValue={row.url}
                placeholder="e.g. https://www.linkedin.com/in/…"
                maxLength={LIMIT.link}
                aria-invalid={errors[`profileLinks.${index}`] ? true : undefined}
                className={cn(inputClass, "h-9.5 min-w-0 flex-1 text-caption")}
              />
              {isMain && <span className="flex-none rounded-full bg-green-tint px-2 py-0.5 text-[11px] font-bold text-whatsapp">Main</span>}
              <button type="button" className={ghostIconButton} aria-label={`Remove link ${index + 1}`} disabled={list.rows.length === 1} onClick={() => list.remove(row.key)}>
                <Icon name="delete" size={18} />
              </button>
            </li>
          );
        })}
      </ul>
      <FieldError id="profile-links-error" message={Object.entries(errors).find(([field]) => field.startsWith("profileLinks"))?.[1]} />
      <button
        type="button"
        onClick={() => list.add({ url: "" })}
        disabled={list.rows.length >= MAX_PROFILE_LINKS}
        className={cn(secondaryButton, "min-h-8 self-start px-3 text-caption")}
      >
        <Icon name="add" size={16} />
        Add link
      </button>
      <span className="text-xs text-muted-foreground">
        Google uses the main link to know who the author is (there is no author page). Our About page works when they are on it; otherwise use LinkedIn,
        Instagram or their own site. All links are added for Google; none are shown on the article.
      </span>
    </FormGroup>
  );
};
