"use client";

import { useActiveSection } from "@/hooks/useActiveSection";

import type { BlogTocLink } from "../types";

/** "On this page" beside the blog: jumps to each section and marks the one being read. */
export const BlogToc = ({ links }: { links: readonly BlogTocLink[] }) => {
  const { active, jumpTo } = useActiveSection(links.map((link) => link.id));

  return (
    <nav aria-label="On this page" className="flex flex-col gap-2.5">
      <p className="font-display text-xl leading-6.5 font-semibold text-ink">On this page</p>
      <ul className="flex flex-col border-0 border-l-2 border-solid border-line">
        {links.map((link) => {
          const isActive = link.id === active;
          return (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => jumpTo(link.id)}
                className={`-ml-0.5 flex min-h-10 items-center border-0 border-l-2 border-solid py-1 pl-3.5 text-[15px] leading-5.5 no-underline hover:text-navy ${isActive ? "border-navy font-semibold text-navy" : "border-transparent text-text"}`}
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
