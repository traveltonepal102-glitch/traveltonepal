"use client";

import { getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

/** Empty state when no trek matches; offers to clear filters or ask for a custom trek. */
export const NoResults = ({ onClearAll }: { onClearAll: () => void }) => (
  <div className="flex flex-col items-center gap-2.5 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-10 text-center">
    <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand-tint text-brand">
      <Icon name="search" size={24} />
    </span>
    <h3 className="text-h4">No treks match these filters</h3>
    <p className="max-w-105 text-body-sm text-text">
      Try removing a filter, or tell us what you are looking for and we will build a trek around it.
    </p>
    <div className="mt-1 flex flex-wrap justify-center gap-2">
      <button
        type="button"
        onClick={onClearAll}
        className="min-h-10.5 cursor-pointer rounded-md border border-line-strong bg-surface px-4 font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Clear all filters
      </button>
      <a
        href={getWhatsAppUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-10.5 items-center gap-1.5 rounded-md bg-whatsapp px-4 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <WhatsAppLogo size={18} />
        Ask on WhatsApp
      </a>
    </div>
  </div>
);
