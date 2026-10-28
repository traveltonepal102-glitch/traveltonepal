import { SiteImage } from "@/components/ui/SiteImage";

import type { Adventure } from "../types";

/** One custom adventure (design: Main.dc.html): photo with its place-and-season tag, then the title and a short text. */
export const AdventureCard = ({ adventure }: { adventure: Adventure }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-card">
    <div className="relative h-50 flex-none bg-brand-tint">
      <SiteImage image={adventure.photo} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 85vw" className="object-cover" />
      {adventure.tag && (
        <span className="absolute top-3.5 left-3.5 rounded-full bg-saffron px-3 py-1 text-caption font-bold text-ink">{adventure.tag}</span>
      )}
    </div>
    <div className="flex flex-col gap-2 p-5">
      <h3 className="text-h4">{adventure.title}</h3>
      <p className="text-body-sm text-text">{adventure.summary}</p>
    </div>
  </article>
);
