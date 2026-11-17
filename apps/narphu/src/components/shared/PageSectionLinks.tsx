"use client";

import { useEffect, useRef } from "react";

import { useActiveSection } from "@/hooks/useActiveSection";

type PageSectionLinksProps = { links: readonly { id: string; label: string }[] };

/** The menu of a page's sections, in page order: jumps to each, and marks the one being read (a dark pill). Scrolls sideways on a phone. */
export const PageSectionLinks = ({ links }: PageSectionLinksProps) => {
  const { active, jumpTo } = useActiveSection(links.map((link) => link.id));
  const nav = useRef<HTMLElement>(null);

  // On a phone the list scrolls sideways: keep the marked link in view, without moving the page.
  useEffect(() => {
    const list = nav.current;
    const link = active ? list?.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
    if (list && link) list.scrollTo({ left: link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2 });
  }, [active]);

  return (
    <nav ref={nav} aria-label="On this page" className="relative min-w-0 scroll-smooth overflow-x-auto motion-reduce:scroll-auto">
      <ul className="flex gap-1 py-3.5 text-[15px] whitespace-nowrap">
        {links.map((link) => {
          const isActive = link.id === active;
          return (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={() => jumpTo(link.id)}
                className={`inline-flex min-h-10 items-center rounded-full px-3.5 font-medium no-underline focus-visible:-outline-offset-2 ${isActive ? "bg-ink text-paper hover:text-paper" : "text-ink hover:bg-maroon-tint hover:text-maroon"}`}
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
