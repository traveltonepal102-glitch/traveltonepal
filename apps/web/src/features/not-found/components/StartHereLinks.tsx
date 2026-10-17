import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import Link from "next/link";

import { ROUTES } from "@/lib/routes";

type StartLink = { title: string; text: string; href: string; icon: IconName };

const START_LINKS: readonly StartLink[] = [
  { title: "Regions", text: "Nine trekking regions of Nepal on one map.", href: ROUTES.regions, icon: "map" },
  { title: "Travel guides", text: "Permits, seasons, packing and costs.", href: ROUTES.guides, icon: "auto_stories" },
  { title: "About us", text: "Our story and our licensed guides.", href: ROUTES.about, icon: "groups" },
  { title: "Contact", text: "WhatsApp, email and our Kathmandu office.", href: ROUTES.contact, icon: "call" },
];

export const StartHereLinks = () => (
  <section aria-labelledby="start-here-title" className="pt-10 pb-2">
    <div className="mx-auto flex max-w-content flex-col gap-5 px-4 md:px-6">
      <h2 id="start-here-title" className="text-h2-sm md:text-h2">
        Or start from here
      </h2>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {START_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="flex h-full items-start gap-3.5 rounded-lg border border-line bg-surface p-4.5 text-ink transition-shadow hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <span className="inline-flex size-10.5 flex-none items-center justify-center rounded-md bg-brand-tint text-brand">
                <Icon name={link.icon} size={22} />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="font-display text-h4">{link.title}</span>
                <span className="text-caption font-normal text-muted-foreground">{link.text}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
