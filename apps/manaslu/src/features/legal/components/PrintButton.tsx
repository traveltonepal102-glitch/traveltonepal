"use client";

import { TrailIcon } from "@/components/ui/TrailIcon";

/** "Download as PDF": opens the print dialog, where visitors save the page as a PDF (the print view leaves out the menus). */
export const PrintButton = () => (
  <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-solid border-line bg-snow font-semibold text-ink hover:bg-forest-tint">
    <TrailIcon name="doc" className="text-forest" />
    Download as PDF
  </button>
);
