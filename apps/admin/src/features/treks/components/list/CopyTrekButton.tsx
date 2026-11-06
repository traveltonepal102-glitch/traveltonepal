"use client";

import { Icon } from "@ttn/ui/icon";
import { useState } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";

import type { CopyTrekState } from "../../actions/copyTrek";
import type { SimilarTrekOption } from "../../types";
import { CopyTrekPanel } from "./CopyTrekPanel";

export type CopyTrekProps = {
  /** Travel To Nepal's treks. */
  options: SimilarTrekOption[];
  /** The website's region: its treks are listed first. */
  regionId: string | null;
  action: (state: CopyTrekState, formData: FormData) => Promise<CopyTrekState>;
};

/** "Copy a trek" beside "Add trek" on a region website's Treks list. */
export const CopyTrekButton = ({ options, regionId, action }: CopyTrekProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsOpen(true)} className={secondaryButton}>
        <Icon name="content_copy" size={18} />
        Copy a trek
      </button>
      {isOpen && <CopyTrekPanel options={options} regionId={regionId} action={action} onClose={() => setIsOpen(false)} />}
    </>
  );
};
