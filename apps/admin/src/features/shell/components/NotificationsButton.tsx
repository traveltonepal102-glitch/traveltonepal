"use client";

import { Popover } from "@base-ui/react/popover";
import { Icon } from "@ttn/ui/icon";

import { iconButton } from "@/components/ui/buttonStyles";

/** Bell in the top bar. Nothing sends notifications yet, so it opens an honest empty state. */
export const NotificationsButton = () => (
  <Popover.Root>
    <Popover.Trigger aria-label="Notifications" className={iconButton}>
      <Icon name="notifications" size={22} />
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner side="bottom" align="end" sideOffset={8} collisionPadding={12} className="z-100">
        <Popover.Popup className="flex w-72 max-w-[calc(100vw-24px)] flex-col gap-1 rounded-lg border border-solid border-border bg-surface p-4 shadow-popover outline-none">
          <Popover.Title className="m-0 font-display text-h4 text-ink">Notifications</Popover.Title>
          <Popover.Description className="m-0 text-body-sm text-muted-foreground">
            Nothing new yet. New enquiries and reviews will show here.
          </Popover.Description>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
);
