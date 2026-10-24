"use client";

import { Icon } from "@ttn/ui/icon";
import Link from "next/link";
import { useState } from "react";

import { FormSection } from "@/components/ui/FormSection";
import { Switch } from "@/components/ui/Switch";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";

import { SHARED_SECTIONS } from "../../constants";
import type { SharedSectionKey } from "../../types";

type SharedSectionsCardProps = {
  hiddenSharedSections: SharedSectionKey[];
};

/**
 * Sections written once for every trek page (design: section "shared"). Here a trek only switches them on or
 * off; each switch on is sent as sharedSectionShown.
 */
export const SharedSectionsCard = ({ hiddenSharedSections }: SharedSectionsCardProps) => {
  const [hidden, setHidden] = useState(() => new Set(hiddenSharedSections));
  const shownCount = SHARED_SECTIONS.length - hidden.size;

  const toggle = (key: SharedSectionKey, isShown: boolean) =>
    setHidden((current) => {
      const next = new Set(current);
      if (isShown) next.delete(key);
      else next.add(key);
      return next;
    });

  return (
    <FormSection
      title="Show on this trek"
      aside={
        <span className="rounded-full bg-page px-2.5 py-0.5 text-xs font-bold whitespace-nowrap text-muted-foreground">
          {shownCount} of {SHARED_SECTIONS.length} shown
        </span>
      }
    >
      <p className="m-0 flex items-start gap-2.5 rounded-md bg-brand-tint px-3.5 py-3 text-ink">
        <Icon name="info" size={20} className="flex-none text-brand" />
        <span>
          These sections are written <strong>once</strong> and appear on every trek page, so they stay the same everywhere. Here you only
          choose whether they show on this trek. To change the words, open{" "}
          <Link href={ADMIN_SECTIONS.settings.href} className="font-bold text-brand">
            Site settings
          </Link>
          .
        </span>
      </p>

      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {SHARED_SECTIONS.map((section) => {
          const isShown = !hidden.has(section.key);
          return (
            <li key={section.key}>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-solid border-border p-3 hover:border-line-strong">
                <span className="inline-flex size-9.5 flex-none items-center justify-center rounded-md bg-page text-text">
                  <Icon name={section.icon} size={20} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-bold text-ink">{section.label}</span>
                  <span className="block text-xs text-muted-foreground">{section.description}</span>
                  <span className="block text-[11px] font-semibold text-brand">{section.where}</span>
                </span>
                <Switch
                  name="sharedSectionShown"
                  value={section.key}
                  label={`Show ${section.label}`}
                  checked={isShown}
                  onChange={(event) => toggle(section.key, event.target.checked)}
                />
              </label>
            </li>
          );
        })}
      </ul>
    </FormSection>
  );
};
