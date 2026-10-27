import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import type { RemoveBlockerGroup } from "./types";

/** "Remove it from these first": each group with what to do, and a link to every item (opens it to fix it). */
export const RemoveBlockerList = ({ groups }: { groups: readonly RemoveBlockerGroup[] }) => (
  <div className="flex flex-col gap-4">
    {groups.map((group) => (
      <section key={group.label} aria-label={group.label} className="flex flex-col gap-1.5">
        <h3 className="m-0 flex items-center gap-2 text-body-sm font-bold text-ink">
          {group.label}
          <span className="rounded-full bg-muted px-2 py-px text-xs text-text">{group.items.length}</span>
        </h3>
        <p className="m-0 text-caption text-muted-foreground">{group.fix}</p>
        <ul className="m-0 flex list-none flex-col gap-1 p-0">
          {group.items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex items-center justify-between gap-2 rounded-md border border-solid border-border px-3 py-2 text-body-sm text-ink no-underline hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <span className="min-w-0 truncate">{item.name}</span>
                <Icon name="arrow_forward" size={18} className="flex-none" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    ))}
  </div>
);
