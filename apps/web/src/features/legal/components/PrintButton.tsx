"use client";

import { Icon } from "@ttn/ui/icon";

/** "Download as PDF": opens the print dialog, where visitors save the page as a PDF (the print view leaves out the menus). */
export const PrintButton = () => (
  <button
    type="button"
    onClick={() => window.print()}
    className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line-strong bg-surface font-bold text-ink hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    <Icon name="download" size={18} className="text-brand" />
    Download as PDF
  </button>
);
