import { Icon } from "@ttn/ui/icon";

/** Stands in for a screen that isn't built yet. */
export const WorkInProgress = () => (
  <section
    aria-labelledby="work-in-progress"
    className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-14 text-center max-tablet:py-10"
  >
    <span className="inline-flex size-14 items-center justify-center rounded-xl bg-saffron-tint text-saffron-deep">
      <Icon name="construction" size={28} />
    </span>
    <span className="rounded-full border border-solid border-saffron-line bg-saffron-tint px-2.5 py-1 text-xs font-bold text-saffron-ink">
      Work in progress
    </span>
    <h2 id="work-in-progress" className="m-0 font-display text-h3 text-ink">
      We&apos;re building this screen
    </h2>
    <p className="m-0 max-w-105 text-muted-foreground">It isn&apos;t ready yet. It will appear here as soon as it is.</p>
  </section>
);
