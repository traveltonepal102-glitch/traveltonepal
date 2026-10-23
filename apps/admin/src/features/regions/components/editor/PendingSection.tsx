import { Icon } from "@ttn/ui/icon";

type PendingSectionProps = {
  /** What it waits for, e.g. "photo uploads". */
  waitsFor: string;
};

/** A section that opens once another part of the admin exists (photos, treks, guides, travel guides). */
export const PendingSection = ({ waitsFor }: PendingSectionProps) => (
  <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-12 text-center">
    <span className="inline-flex size-12 items-center justify-center rounded-xl bg-saffron-tint text-saffron-deep">
      <Icon name="construction" size={26} />
    </span>
    <span className="rounded-full border border-solid border-saffron-line bg-saffron-tint px-2.5 py-1 text-xs font-bold text-saffron-ink">
      Work in progress
    </span>
    <p className="m-0 max-w-105 text-muted-foreground">This part opens once {waitsFor} are in the admin. Nothing here is saved yet.</p>
  </div>
);
