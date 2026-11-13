import type { GuidePerson } from "@ttn/site-data/guideBlocks";

import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";

import type { BlogAuthor as Author } from "../types";

/** Who wrote the blog, and who checked it. */
export const BlogAuthor = ({ author, checker }: { author: Author; checker?: GuidePerson }) => (
  <aside aria-label="About the author" className="flex flex-col gap-4 rounded-2xl border border-solid border-line p-5 sm:flex-row sm:items-start">
    <span className="relative flex size-18 flex-none items-center justify-center overflow-hidden rounded-full bg-sky text-navy">
      {author.photo ? <SiteImage image={author.photo} sizes="72px" className="object-cover" /> : <TrailIcon name="users" size={30} />}
    </span>
    <div className="flex flex-col gap-1">
      <p className="text-sm leading-5 text-muted">Written by</p>
      <p className="font-display text-xl leading-6.5 font-semibold text-ink">{author.name}</p>
      {author.role && <p className="text-[15px] leading-5.5 font-semibold text-navy">{author.role}</p>}
      {author.bio && <p className="mt-1 text-[15px] leading-5.75">{author.bio}</p>}
      {checker && (
        <p className="mt-1 inline-flex items-start gap-1.5 text-sm leading-5 text-muted">
          <TrailIcon name="check" size={16} className="mt-0.5 flex-none text-navy" />
          Checked by {checker.name}
          {checker.role ? `, ${checker.role}` : ""}
        </p>
      )}
    </div>
  </aside>
);
