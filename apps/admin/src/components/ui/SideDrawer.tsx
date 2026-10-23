"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Icon } from "@ttn/ui/icon";
import type { ReactNode } from "react";

import { iconButton } from "./buttonStyles";

type SideDrawerProps = {
  /** Small line above the title, e.g. "Edit trekking guide". */
  kicker: string;
  title: string;
  /** Under the title, e.g. the save status. */
  status?: ReactNode;
  /** Asked to close (✕, Escape, a click outside or a <Dialog.Close> inside). Decide here whether to close. */
  onClose: () => void;
  children: ReactNode;
};

/**
 * A modal panel that slides in from the right over the page: 45% of the width on desktop, the full screen on
 * tablets and phones. Open while it is rendered (the page decides, e.g. from the URL); focus stays inside
 * and the page behind doesn't scroll (Base UI Dialog).
 */
export const SideDrawer = ({ kicker, title, status, onClose, children }: SideDrawerProps) => (
  <Dialog.Root open onOpenChange={(isOpen) => !isOpen && onClose()}>
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-95 bg-navy/45 transition-opacity duration-200 starting:opacity-0" />
      <Dialog.Popup className="fixed inset-0 z-95 flex flex-col bg-surface shadow-popover outline-none transition-transform duration-250 ease-out starting:translate-x-full desktop:left-auto desktop:w-[45vw] desktop:border-l desktop:border-solid desktop:border-border">
        <div className="flex items-start justify-between gap-3 border-b border-solid border-border px-6 py-4 max-tablet:px-5">
          <div className="min-w-0">
            <p className="m-0 text-xs font-bold tracking-wider text-muted-foreground uppercase">{kicker}</p>
            <Dialog.Title className="m-0 truncate font-display text-h4 text-ink">{title}</Dialog.Title>
            {status}
          </div>
          <Dialog.Close aria-label="Close" className={iconButton}>
            <Icon name="close" size={20} />
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
);
