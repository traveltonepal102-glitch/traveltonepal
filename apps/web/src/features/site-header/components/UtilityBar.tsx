import { CONTACT, getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { ROUTES } from "@/lib/routes";
import { HAS_GERMAN_SITE } from "@/lib/site";

import type { HeaderVariant } from "./HeaderMenuProvider";

const LINK = "inline-flex items-center gap-1.5 rounded-sm hover:text-white focus-visible:outline-2 focus-visible:outline-white";

/** Thin top bar (desktop and tablet): licence, email, WhatsApp, language. */
export const UtilityBar = ({ variant }: { variant: HeaderVariant }) => (
  <div className={`max-md:hidden text-navy-text ${variant === "overlay" ? "border-b border-white/15" : "bg-navy"}`}>
    <div className="mx-auto flex min-h-9 max-w-content flex-wrap items-center justify-between gap-x-5 gap-y-1.5 px-6 text-xs">
      <p className="inline-flex items-center gap-1.5">
        <Icon name="verified" size={15} className="text-whatsapp-on-dark" />
        Government-licensed trekking agency · Reg. {CONTACT.registrationNumber} · TAAN member
      </p>
      <div className="flex items-center gap-4.5">
        <a href={getEmailUrl()} className={LINK}>
          <Icon name="mail" size={15} />
          {CONTACT.email}
        </a>
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={`${LINK} font-semibold text-whatsapp-on-dark`}
        >
          <Icon name="chat" size={15} />
          {CONTACT.phoneDisplay}
          <span className="sr-only"> on WhatsApp</span>
        </a>
        {HAS_GERMAN_SITE && (
          <nav aria-label="Language" className="flex items-center gap-1">
            <a href={ROUTES.home} aria-current="true" className={`${LINK} font-bold text-white`}>
              EN
            </a>
            <span aria-hidden="true" className="opacity-50">
              /
            </span>
            <a href={ROUTES.german} lang="de" hrefLang="de" className={LINK}>
              DE
            </a>
          </nav>
        )}
      </div>
    </div>
  </div>
);
