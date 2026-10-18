import { Icon } from "@ttn/ui/icon";

import { KICKER } from "../styles";

/** "Written by": author photo placeholder, name and short bio, at the end of the article. */
export const AuthorBox = ({ name, bio }: { name: string; bio: string }) => (
  <aside aria-label="About the author" className="mt-2 flex flex-col gap-4 rounded-2xl border border-line bg-page p-5 sm:flex-row sm:items-start">
    <span aria-hidden="true" className="inline-flex size-16 flex-none items-center justify-center rounded-full border-2 border-brand bg-brand-tint text-brand">
      <Icon name="person" size={34} />
    </span>
    <div className="flex flex-col gap-1.5">
      <p className={KICKER}>Written by</p>
      <p className="font-display text-lg font-bold text-ink">{name}</p>
      <p className="text-body-sm text-text">{bio}</p>
    </div>
  </aside>
);
