"use client";

import { TrailIcon } from "@/components/ui/TrailIcon";

/** "Drucken oder als PDF speichern": opens the print dialog, where visitors save the page as a PDF (the print view leaves out the menus). */
export const PrintButton = () => (
  <button type="button" onClick={() => window.print()} className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 self-start border-0 bg-transparent px-1 font-[inherit] text-[15px] font-bold text-ocean hover:text-ocean-deep">
    <TrailIcon name="doc" size={18} />
    Drucken oder als PDF speichern
  </button>
);
