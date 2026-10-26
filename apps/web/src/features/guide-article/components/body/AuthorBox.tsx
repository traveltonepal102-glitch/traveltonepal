import { Icon } from "@ttn/ui/icon";

import { SiteImage } from "@/components/ui/SiteImage";

import type { ArticleAuthor, GuidePerson } from "../../types";
import { KICKER } from "../styles";

/** "Written by": the author's photo, name, role and short bio, and who fact-checked the guide, at the end of the article. */
export const AuthorBox = ({ author, checker }: { author: ArticleAuthor; checker?: GuidePerson }) => (
  <aside aria-label="About the author" className="mt-2 flex flex-col gap-4 rounded-2xl border border-line bg-page p-5 sm:flex-row sm:items-start">
    <span className="relative inline-flex size-16 flex-none items-center justify-center overflow-hidden rounded-full border-2 border-brand bg-brand-tint text-brand">
      {author.photo ? <SiteImage image={author.photo} sizes="64px" className="object-cover" /> : <Icon name="person" size={34} />}
    </span>
    <div className="flex flex-col gap-1.5">
      <p className={KICKER}>Written by</p>
      <p className="inline-flex items-center gap-1.5 font-display text-lg font-bold text-ink">
        {author.name}
        {author.isVerified && <Icon name="verified" size={18} label="Verified author" className="text-whatsapp" />}
      </p>
      {author.role && <p className="text-caption font-semibold text-brand">{author.role}</p>}
      {author.bio && <p className="text-body-sm text-text">{author.bio}</p>}
      {checker && (
        <p className="mt-1 inline-flex items-center gap-1.5 text-caption text-muted-foreground">
          <Icon name="verified" size={16} className="text-whatsapp" />
          Fact-checked by {checker.name}
          {checker.role ? `, ${checker.role}` : ""}
        </p>
      )}
    </div>
  </aside>
);
