"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { useEffect, useId, useRef, useState } from "react";

import { outlineButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";

import type { NavMenu } from "./types";

type MobileMenuProps = {
  menus: readonly NavMenu[];
  links: readonly { href: string; label: string }[];
  /** At the bottom of the panel: "Plan my trek" and the email button. */
  children: ReactNode;
};

/** Where the header shows the full menu instead (Tailwind's lg). */
const WIDE_SCREEN = "(min-width: 64rem)";
const ROW = "flex min-h-13 w-full items-center justify-between gap-3 border-0 border-b border-solid border-line text-lg font-semibold text-ink no-underline";

/**
 * The menu on phones and tablets: a button that opens the links in a panel from the right, over the dimmed page (a modal
 * dialog: focus stays in it, Escape closes it and focus goes back to the button). "Other treks" and "Blogs" fold open
 * one at a time. A link chosen, a tap beside the panel, or the screen growing wide enough for the full menu closes it.
 */
export const MobileMenu = ({ menus, links, children }: MobileMenuProps) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  // The panel's contents are rendered only while it is open (they would weigh on every page otherwise), so the dialog
  // opens once they are there: that is where showModal() puts the focus (the close button).
  const open = () => setIsOpen(true);
  const close = () => dialog.current?.close();
  // The panel fills the dialog, so a click on the dialog itself landed on the dimmed page beside it.
  const closeOnLinkOrBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget || (event.target instanceof Element && event.target.closest("a"))) close();
  };

  useEffect(() => {
    if (!isOpen) return;
    if (!dialog.current?.open) dialog.current?.showModal();
    const wide = window.matchMedia(WIDE_SCREEN);
    const closeWhenWide = () => wide.matches && dialog.current?.close();
    wide.addEventListener("change", closeWhenWide);
    return () => wide.removeEventListener("change", closeWhenWide);
  }, [isOpen]);

  return (
    <>
      <button type="button" onClick={open} aria-label="Menu" aria-expanded={isOpen} aria-controls={id} className={`${outlineButton} w-12 flex-none px-0! lg:hidden`}>
        <TrailIcon name="menu" size={22} />
      </button>
      <dialog
        id={id}
        ref={dialog}
        aria-label="Menu"
        onClose={() => setIsOpen(false)}
        onClick={closeOnLinkOrBackdrop}
        className="m-0 ml-auto h-dvh max-h-none w-[min(24rem,calc(100%-3rem))] max-w-none overscroll-contain border-0 bg-snow p-0 text-ink transition-transform duration-200 backdrop:overflow-hidden backdrop:overscroll-contain backdrop:bg-ink/50 starting:translate-x-full motion-reduce:transition-none"
      >
        {isOpen && (
        <div className="flex min-h-full flex-col gap-6 px-5 pt-3 pb-6">
          <div className="flex items-center justify-between">
            <p className="eyebrow">Menu</p>
            {/* The first thing focusable: where showModal() puts the focus. */}
            <button type="button" onClick={close} aria-label="Close menu" className="inline-flex size-12 cursor-pointer items-center justify-center rounded-xl border-0 bg-transparent text-ink hover:bg-sky">
              <TrailIcon name="close" size={22} />
            </button>
          </div>

          <nav aria-label="Main">
            <ul className="m-0 flex list-none flex-col p-0">
              {menus
                .filter((menu) => menu.items.length > 0)
                .map((menu) => (
                  <li key={menu.label}>
                    <details name={`${id}-lists`} className="group">
                      <summary className={`${ROW} cursor-pointer list-none [&::-webkit-details-marker]:hidden`}>
                        {menu.label}
                        <TrailIcon name="chevron" size={18} className="transition-transform group-open:rotate-180" />
                      </summary>
                      <ul className="m-0 flex list-none flex-col gap-0.5 border-0 border-b border-solid border-line py-2 pl-3">
                        {menu.items.map((item) => (
                          <li key={item.title}>
                            <Link href={item.href} className="flex min-h-11 flex-col justify-center rounded-[10px] px-2 py-1.5 no-underline hover:bg-sky">
                              <span className="leading-5.5 font-semibold text-ink">{item.title}</span>
                              {item.text && <span className="text-sm leading-5 text-muted">{item.text}</span>}
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link href={menu.more.href} className="inline-flex min-h-11 items-center gap-1.5 px-2 font-semibold no-underline">
                            {menu.more.label}
                            <TrailIcon name="arrow" size={16} />
                          </Link>
                        </li>
                      </ul>
                    </details>
                  </li>
                ))}
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={ROW}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-2.5">{children}</div>
        </div>
        )}
      </dialog>
    </>
  );
};
