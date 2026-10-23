"use client";

import { Menu } from "@base-ui/react/menu";
import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import { primaryButton } from "@/components/ui/buttonStyles";

import type { NewItemTone } from "../newItems";
import { NEW_ITEMS } from "../newItems";

const TONE_CLASSES: Record<NewItemTone, string> = {
  brand: "bg-brand-tint text-brand",
  saffron: "bg-saffron-tint text-saffron-deep",
  green: "bg-green-tint text-whatsapp",
};

/** "New" in the top bar: shortcuts to add a trek, date, guide, person or photos. */
export const NewMenu = () => (
  <Menu.Root>
    <Menu.Trigger className={primaryButton}>
      <Icon name="add" />
      New
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner side="bottom" align="end" sideOffset={8} collisionPadding={12} className="z-100 outline-none">
        <Menu.Popup className="w-70 max-w-[calc(100vw-24px)] rounded-lg border border-solid border-border bg-surface p-2 shadow-popover outline-none">
          {NEW_ITEMS.map((item) => (
            <Menu.LinkItem
              key={item.label}
              closeOnClick
              render={<Link href={item.href} />}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-body-sm font-semibold text-ink no-underline outline-none data-highlighted:bg-brand-tint"
            >
              <span
                aria-hidden="true"
                className={cn("inline-flex size-8.5 flex-none items-center justify-center rounded-md", TONE_CLASSES[item.tone])}
              >
                <Icon name={item.icon} />
              </span>
              <span>
                <span className="block">{item.label}</span>
                <span className="block text-xs font-medium text-muted-foreground">{item.hint}</span>
              </span>
            </Menu.LinkItem>
          ))}
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
);
