import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import Image from "next/image";

import { AdminBadge } from "./AdminBadge";

const FEATURES: readonly { icon: IconName; title: string; text: string }[] = [
  { icon: "wand_stars", title: "AI drafts, your final say", text: "Nothing goes live until you review and publish it." },
  { icon: "public", title: "Ten sites, English and German", text: "Pick a site, add content, publish. Each keeps its own brand." },
  { icon: "dashboard", title: "Google results for every site", text: "Clicks, positions and WhatsApp chats in one view." },
];

/** Left half of the sign-in screen on wide screens: photo, logo, what the admin is for. */
export const AuthPhotoPanel = () => (
  <aside className="relative hidden flex-col justify-between overflow-hidden bg-navy px-12 py-10 text-white lg:flex">
    <Image src="/images/kyanjin-gompa-prayer-wheels.jpg" alt="" fill preload sizes="50vw" className="object-cover opacity-55" />
    <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-navy/55 via-navy/25 via-40% to-navy/92" />

    <div className="relative flex items-center justify-between gap-4">
      <Image src="/brand/logo-white.svg" alt="Travel To Nepal" width={91} height={52} className="h-13 w-auto" />
      <AdminBadge />
    </div>

    <div className="relative flex max-w-140 flex-col gap-5.5">
      <p className="m-0 font-display text-[44px] leading-[1.1] font-extrabold tracking-tight">One place to run all ten websites.</p>
      <p className="m-0 text-body-lg text-[#d6e2ee]">
        Add treks, departure dates and travel guides, and see how every site is doing on Google.
      </p>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {FEATURES.map((feature) => (
          <li key={feature.title} className="flex items-center gap-3.5 rounded-2xl border border-solid border-white/16 bg-white/9 px-4 py-3 backdrop-blur-sm">
            <span aria-hidden="true" className="inline-flex size-9.5 flex-none items-center justify-center rounded-md bg-saffron/20 text-saffron">
              <Icon name={feature.icon} size={22} />
            </span>
            <span className="flex flex-col">
              <span className="text-[15px] font-bold">{feature.title}</span>
              <span className="text-caption font-normal text-[#c9d6e3]">{feature.text}</span>
            </span>
          </li>
        ))}
      </ul>
      <p className="m-0 text-xs text-[#9fb3c8]">Prayer wheels at Kyanjin Gompa, Langtang · photo by Travel To Nepal</p>
    </div>
  </aside>
);
