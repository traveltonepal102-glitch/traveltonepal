import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";

import { REGIONS_PATH } from "../../constants";

export type SaveStatusTone = "saved" | "unsaved" | "neutral";

type RegionEditorHeaderProps = {
  title: string;
  status: string;
  statusTone: SaveStatusTone;
  saveLabel: string;
  isSaving: boolean;
};

const DOT_CLASSES: Record<SaveStatusTone, string> = {
  saved: "bg-whatsapp",
  unsaved: "bg-saffron",
  neutral: "bg-subtle",
};

/** Sticky bar under the top bar: back to Regions, the region's name and save state, and Save. */
export const RegionEditorHeader = ({ title, status, statusTone, saveLabel, isSaving }: RegionEditorHeaderProps) => (
  <div className="sticky top-16.25 z-30 -mx-8 -mt-7 flex items-center gap-3 border-b border-solid border-border bg-surface px-8 py-3 max-tablet:top-15.25 max-tablet:-mx-4 max-tablet:-mt-4 max-tablet:px-4">
    <Link href={REGIONS_PATH} aria-label="Back to regions" className={cn(secondaryButton, "min-h-8 px-2.5 text-caption")}>
      <Icon name="arrow_back" size={18} />
      <span className="max-tablet:hidden">Regions</span>
    </Link>
    <div className="min-w-0 flex-1">
      <h1 className="m-0 truncate font-display text-h4 text-ink">{title}</h1>
      <p role="status" className="m-0 flex items-center gap-1.5 text-xs text-muted-foreground">
        <span aria-hidden="true" className={cn("size-2 flex-none rounded-full", DOT_CLASSES[statusTone])} />
        {status}
      </p>
    </div>
    <button type="submit" disabled={isSaving} className={cn(primaryButton, "disabled:cursor-wait disabled:opacity-70")}>
      {isSaving ? "Saving…" : saveLabel}
    </button>
  </div>
);
