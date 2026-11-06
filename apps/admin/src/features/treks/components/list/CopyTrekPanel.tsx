"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Icon } from "@ttn/ui/icon";
import { useActionState, useState } from "react";

import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FormAlert } from "@/components/ui/FormAlert";
import { inputClass } from "@/components/ui/formStyles";
import { SideDrawer } from "@/components/ui/SideDrawer";
import { PhotoImage } from "@/features/photos/components/PhotoImage";

import type { SimilarTrekOption } from "../../types";
import type { CopyTrekProps } from "./CopyTrekButton";

type CopyTrekPanelProps = CopyTrekProps & { onClose: () => void };

const NO_ERROR = { error: null };

const isInRegion = (trek: SimilarTrekOption, regionId: string | null) => trek.regionId === regionId || (regionId !== null && trek.routeRegionIds.includes(regionId));

/** The window behind "Copy a trek": Travel To Nepal's treks (this website's region first), pick one, copy it as a draft. */
export const CopyTrekPanel = ({ options, regionId, action, onClose }: CopyTrekPanelProps) => {
  const [state, formAction, isCopying] = useActionState(action, NO_ERROR);
  const [query, setQuery] = useState("");
  const [chosenId, setChosenId] = useState<string | null>(null);
  const shown = options.filter((trek) => trek.name.toLowerCase().includes(query.trim().toLowerCase()));
  const inRegion = shown.filter((trek) => isInRegion(trek, regionId));
  const others = shown.filter((trek) => !isInRegion(trek, regionId));
  const groups = [
    { title: "In this website's region", treks: inRegion },
    { title: inRegion.length ? "Other regions" : "All treks", treks: others },
  ];

  return (
    <SideDrawer kicker="Travel To Nepal" title="Copy a trek" status={<p className="m-0 text-xs text-muted-foreground">Fills the form to save typing. Then change the words: the copy is a separate draft.</p>} onClose={onClose}>
      <form action={formAction} className="flex min-h-0 flex-1 flex-col">
        <input type="hidden" name="trekId" value={chosenId ?? ""} />
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-5">
          {state.error && <FormAlert message={state.error} />}
          <input type="search" aria-label="Search treks by name" placeholder="Search treks by name" value={query} onChange={(event) => setQuery(event.target.value)} className={inputClass} />
          {groups.map(
            (group) =>
              group.treks.length > 0 && (
                <div key={group.title} className="flex flex-col gap-1">
                  <span className="px-1 pb-1 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">{group.title}</span>
                  {group.treks.map((trek) => (
                    <button
                      key={trek.id}
                      type="button"
                      aria-pressed={trek.id === chosenId}
                      onClick={() => setChosenId(trek.id)}
                      className="m-0 flex cursor-pointer items-center gap-3 rounded-md border border-solid border-transparent bg-transparent p-2 text-left font-sans hover:bg-page aria-pressed:border-brand aria-pressed:bg-surface"
                    >
                      <span className="flex aspect-4/3 w-16 flex-none items-center justify-center overflow-hidden rounded-sm bg-page text-subtle">
                        {trek.cover ? <PhotoImage photo={trek.cover} alt="" sizes="64px" className="block h-full w-full object-cover" /> : <Icon name="landscape" size={22} />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <strong className="block truncate text-body-sm text-ink">{trek.name}</strong>
                        <span className="block truncate text-xs text-muted-foreground">
                          {trek.days} days · {trek.regionName}
                        </span>
                      </span>
                      {trek.id === chosenId && <Icon name="check_circle" size={20} className="flex-none text-brand" />}
                    </button>
                  ))}
                </div>
              ),
          )}
          {shown.length === 0 && <p className="m-0 px-1 py-6 text-center text-caption text-muted-foreground">No trek has that name.</p>}
          <p className="m-0 rounded-md bg-page px-3 py-2 text-xs text-muted-foreground">Everything is copied except similar treks, the printable PDF map, the canonical address and “Hide from Google”.</p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-solid border-border px-6 py-3 max-tablet:px-5">
          <Dialog.Close type="button" className={secondaryButton}>
            Cancel
          </Dialog.Close>
          <button type="submit" disabled={!chosenId || isCopying} className={`${primaryButton} disabled:cursor-not-allowed disabled:opacity-60`}>
            <Icon name="content_copy" size={18} />
            {isCopying ? "Copying…" : "Copy as a draft"}
          </button>
        </div>
      </form>
    </SideDrawer>
  );
};
