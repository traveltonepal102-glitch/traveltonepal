import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { ROUTES } from "@/lib/routes";
import { HAS_GERMAN_SITE } from "@/lib/site";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import { NAV_TABS } from "../navigation";

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** Phone and tablet menu: the five sections, language, WhatsApp and email. */
export const MobileMenuContent = () => (
  <nav aria-label="Mobile" className="mx-auto flex max-w-content flex-col px-4 pt-2 pb-5 md:px-6">
    {NAV_TABS.map((tab) => (
      <Link
        key={tab.key}
        href={tab.href}
        className={`flex min-h-13.5 items-center justify-between border-b border-line font-display text-h4 text-ink ${FOCUS_RING}`}
      >
        {tab.label}
        <Icon name="arrow_forward" className="text-subtle" />
      </Link>
    ))}
    {HAS_GERMAN_SITE && (
      <p className="py-4 text-body-sm text-text">
        Language:{" "}
        <a href={ROUTES.home} aria-current="true" className="font-bold text-brand">
          English
        </a>{" "}
        ·{" "}
        <a href={ROUTES.german} lang="de" hrefLang="de" className="text-text hover:text-brand">
          Deutsch
        </a>
      </p>
    )}
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex min-h-13 items-center justify-center gap-2 rounded-md bg-whatsapp font-extrabold text-on-brand ${FOCUS_RING}`}
    >
      <WhatsAppLogo />
      Plan my trek on WhatsApp
    </a>
    <a
      href={getEmailUrl()}
      className={`mt-2.5 flex min-h-12 items-center justify-center gap-2 rounded-md border border-line-strong font-bold text-ink ${FOCUS_RING}`}
    >
      <Icon name="mail" size={18} className="text-brand" />
      Email us
    </a>
  </nav>
);
