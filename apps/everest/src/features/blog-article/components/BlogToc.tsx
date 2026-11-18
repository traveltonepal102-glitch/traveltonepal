"use client";

import { useActiveSection } from "@/hooks/useActiveSection";

import type { BlogTocLink } from "../types";

/** "On this page" beside the blog: jumps to each section and marks the one being read. */
export const BlogToc = ({ links }: { links: readonly BlogTocLink[] }) => {
  const { active, jumpTo } = useActiveSection(links.map((link) => link.id));

  return (
    <nav aria-label="Auf dieser Seite" className="flex flex-col gap-2.5">
      <p className="font-display text-xl leading-6.5 font-semibold text-ink">Auf dieser Seite</p>
      <ul className="flex flex-col border-0 border-l-2 border-solid border-line">
        {links.map((link) => {
          const isActive = link.id === active;
          return (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => jumpTo(link.id)}
                className={`-ml-0.5 flex min-h-10 items-center border-0 border-l-2 border-solid py-1 pl-3.5 text-[15px] leading-5.5 no-underline hover:text-ocean ${isActive ? "border-ocean font-semibold text-ocean" : "border-transparent text-text"}`}
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
