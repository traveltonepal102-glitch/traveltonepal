import { getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

/** Empty state when no guide matches; offers to clear the filters or ask the team directly. */
export const GuideNoResults = ({ onClearAll }: { onClearAll: () => void }) => (
  <div className="flex flex-col items-center gap-2.5 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-10 text-center">
    <span className="inline-flex size-12 items-center justify-center rounded-full bg-brand-tint text-brand">
      <Icon name="search" size={24} />
    </span>
    <h3 className="text-h4">No guides match your search</h3>
    <p className="max-w-105 text-body-sm text-text">
      Try another word or topic, or ask us: we answer trek planning questions on WhatsApp every day.
    </p>
    <div className="mt-1 flex flex-wrap justify-center gap-2">
      <button
        type="button"
        onClick={onClearAll}
        className="min-h-10.5 cursor-pointer rounded-md border border-line-strong bg-surface px-4 font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        Show all guides
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
