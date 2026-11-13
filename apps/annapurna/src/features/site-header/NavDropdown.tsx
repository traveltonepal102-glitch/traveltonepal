"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useId, useRef, useState } from "react";

import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";

import type { NavMenu } from "./types";

const ONE_COLUMN_PANEL = "left-0 w-100 max-sm:fixed max-sm:inset-x-4 max-sm:top-auto max-sm:w-auto";
/** Centred under its button where the menu has one row, as wide as the screen where it hasn't (the button may sit near an edge). */
const TWO_COLUMN_PANEL = "lg:left-1/2 lg:w-190 lg:-translate-x-1/2 max-lg:fixed max-lg:inset-x-4 max-lg:top-auto";

type NavDropdownProps = NavMenu & {
  /** Wider, the list running down one column and then the other; one column on a phone. */
  hasTwoColumns?: boolean;
};

/** A menu item that opens a list of links with their photos (loaded only once it is open): closes on Escape, a click outside or a link chosen. Left out with nothing to list. */
export const NavDropdown = ({ label, items, more, heading, hasTwoColumns = false }: NavDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setIsOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      button.current?.focus();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  if (items.length === 0) return null;
  const close = () => setIsOpen(false);

  return (
    <div
      ref={root}
      className="relative"
      onBlur={(event) => {
        // Tabbing past the list closes it; a click on empty space is the pointer's job above.
        if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) close();
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={isOpen}
        aria-controls={isOpen ? panelId : undefined}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex min-h-11 cursor-pointer items-center gap-1 border-0 bg-transparent font-semibold whitespace-nowrap text-ink hover:text-ember"
      >
        {label}
        <TrailIcon name="chevron" size={14} className={isOpen ? "rotate-180" : ""} />
      </button>
      {isOpen && (
        <div id={panelId} className={`absolute top-full z-40 mt-1 flex max-h-[75vh] flex-col overflow-y-auto rounded-[14px] border border-solid border-line bg-snow p-2 text-ink shadow-raised ${hasTwoColumns ? TWO_COLUMN_PANEL : ONE_COLUMN_PANEL}`}>
          {heading && <p className="eyebrow px-2 pt-2 pb-1.5">{heading}</p>}
          <ul
            className={hasTwoColumns ? "grid gap-x-2 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-[repeat(var(--rows),auto)]" : "flex flex-col"}
            // Down the first column, then the second: ten blogs make five and five.
            style={hasTwoColumns ? ({ "--rows": Math.ceil(items.length / 2) } as CSSProperties) : undefined}
          >
            {items.map((item) => (
              <li key={item.title}>
                <Link href={item.href} onClick={close} className="flex items-center gap-3 rounded-[10px] p-2 no-underline hover:bg-sky">
                  <span className="relative flex size-16 flex-none items-center justify-center overflow-hidden rounded-[10px] bg-sky text-navy/40">
                    {/* Decorative: the title is right beside it. */}
                    {item.image ? <SiteImage image={{ ...item.image, alt: "" }} sizes="64px" className="object-cover" /> : <TrailIcon name="mountain" size={24} />}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="leading-5.5 font-semibold text-ink">{item.title}</span>
                    {item.text && <span className="text-sm leading-5 font-normal text-muted">{item.text}</span>}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={more.href} onClick={close} className="mt-1 inline-flex min-h-11 flex-none items-center justify-center gap-1.5 border-t border-solid border-line px-3 font-semibold no-underline">
            {more.label}
            <TrailIcon name="arrow" size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};
