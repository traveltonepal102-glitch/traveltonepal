import type { RemoveBlockerGroup } from "./types";

/** One kind of thing that can still use an item: its heading, what to do, and where each one is edited. */
export type RemoveBlockerKind = { label: string; fix: string; href: (id: string) => string };

/**
 * What still uses an item (a `*_usage` function's rows), grouped for the delete window in the order of `kinds`;
 * empty when it can be deleted.
 */
export const toRemoveBlockers = <Kind extends string>(
  usage: readonly { kind: Kind; id: string; name: string }[],
  kinds: readonly (readonly [Kind, RemoveBlockerKind])[],
): RemoveBlockerGroup[] =>
  kinds.flatMap(([kind, { label, fix, href }]) => {
    const items = usage.filter((item) => item.kind === kind);
    if (!items.length) return [];
    return [{ label, fix, items: items.map((item) => ({ id: item.id, name: item.name, href: href(item.id) })) }];
  });
