"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useState } from "react";

import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";
import { SideDrawer } from "@/components/ui/SideDrawer";

import { SECTION_GROUPS, SECTION_KINDS } from "../../../sectionKinds";
import type { SectionType } from "../../../types";

type AddSectionPanelProps = {
  /** e.g. "after “Autumn”" or "at the top of the article body". */
  placeLabel: string;
  /** Kinds once per guide that the guide already has. */
  usedOnceTypes: SectionType[];
  onAdd: (type: SectionType) => void;
  onClose: () => void;
};

/** "Add a section to the article" (design: the side panel): the catalog by group, then what the chosen one does. */
export const AddSectionPanel = ({ placeLabel, usedOnceTypes, onAdd, onClose }: AddSectionPanelProps) => {
  const [chosenName, setChosenName] = useState(SECTION_KINDS[0].name);
  const chosen = SECTION_KINDS.find((kind) => kind.name === chosenName) ?? SECTION_KINDS[0];
  const isUsed = chosen.type !== null && usedOnceTypes.includes(chosen.type);
  const tone = (group: string) => SECTION_GROUPS.find((item) => item.value === group)?.tone;

  return (
    <SideDrawer kicker="Article body" title="Add a section to the article" status={<p className="m-0 text-xs font-semibold text-brand">It will go {placeLabel}</p>} onClose={onClose}>
      <div className="grid min-h-0 flex-1 overflow-y-auto tablet:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-3 border-solid border-border p-4 tablet:border-r">
          {SECTION_GROUPS.map((group) => (
            <div key={group.value} className="flex flex-col gap-0.5">
              <span className="px-2.5 pb-1 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">{group.label}</span>
              {SECTION_KINDS.filter((kind) => kind.group === group.value).map((kind) => (
                <button
                  key={kind.name}
                  type="button"
                  aria-pressed={kind.name === chosen.name}
                  onClick={() => setChosenName(kind.name)}
                  className="m-0 flex cursor-pointer items-center gap-2.5 rounded-md border border-solid border-transparent bg-transparent px-2.5 py-1.5 text-left font-sans text-body-sm font-semibold text-ink hover:bg-page aria-pressed:border-brand aria-pressed:bg-surface"
                >
                  <span className={cn("inline-flex size-8 flex-none items-center justify-center rounded-md", tone(kind.group))}>
                    <Icon name={kind.icon} size={18} />
                  </span>
                  <span className="min-w-0 flex-1">{kind.name}</span>
                  {!kind.type && <span className="rounded-full bg-muted px-2 text-[11px] font-bold text-muted-foreground">Coming soon</span>}
                </button>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 self-start p-5 tablet:sticky tablet:top-0 max-tablet:border-t max-tablet:border-solid max-tablet:border-border">
          <span className={cn("inline-flex size-12 items-center justify-center rounded-lg", tone(chosen.group))}>
            <Icon name={chosen.icon} size={26} />
          </span>
          <h3 className="m-0 font-display text-xl font-bold text-ink">{chosen.name}</h3>
          <p className="m-0 text-text">{chosen.description}</p>
          <p className="m-0 text-caption">
            <strong className="text-ink">Good for:</strong> {chosen.goodFor}
          </p>
          <div className="text-caption">
            <strong className="text-ink">You fill in:</strong>
            <ul className="m-0 mt-1 flex list-disc flex-col gap-1 pl-5">
              {chosen.youFillIn.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          {!chosen.type && <p className="m-0 rounded-md bg-saffron-tint px-3 py-2 text-caption text-saffron-ink">Coming soon: this kind of section is built in a next step.</p>}
          {isUsed && <p className="m-0 rounded-md bg-saffron-tint px-3 py-2 text-caption text-saffron-ink">Already in this guide: a guide has one “{chosen.name}”.</p>}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-solid border-border px-6 py-3 max-tablet:px-5">
        <Dialog.Close type="button" className={secondaryButton}>
          Cancel
        </Dialog.Close>
        <button type="button" disabled={!chosen.type || isUsed} onClick={() => chosen.type && onAdd(chosen.type)} className={primaryButton}>
          <Icon name="add" size={18} />
          Add “{chosen.name}” here
        </button>
      </div>
    </SideDrawer>
  );
};
