import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";
import type { ReactNode } from "react";

import { ButtonLink } from "@/components/ui/ButtonLink";

import type { LegalDoc } from "../types";
import { LegalBlocks } from "./LegalBlocks";
import { LegalHeader } from "./LegalHeader";
import { LegalSectionBlock } from "./LegalSectionBlock";
import { LegalSidebar } from "./LegalSidebar";
import { PANEL, WRAP } from "./styles";

const isDevelopment = process.env.NODE_ENV === "development";

type LegalPageProps = {
  doc: LegalDoc;
  /** Shown above the sections, e.g. the cookie choices on the Cookie settings page. */
  children?: ReactNode;
};

/** A legal page (design: Legal.dc.html): title band, side menu and the numbered document (from Pages › Legal pages). */
export const LegalPage = ({ doc, children }: LegalPageProps) => (
  <>
    <LegalHeader doc={doc} />
    <div className={`${WRAP} grid items-start gap-8 pt-8 pb-14 lg:grid-cols-[260px_minmax(0,1fr)]`}>
      <LegalSidebar doc={doc} />
      <article aria-labelledby="legal-title" className={`${PANEL} flex min-w-0 flex-col gap-7 p-5 shadow-card md:px-10 md:py-9`}>
        {/* For the owner only: never shown to visitors. */}
        {isDevelopment && doc.ownerNote && (
          <p className="flex gap-3 rounded-xl border border-saffron-line bg-saffron-tint px-4 py-3.5 text-body-sm text-[#5a3300]">
            <Icon name="info" size={20} className="mt-px flex-none text-saffron-deep" />
            <span>
              <strong>Owner note (only shown in development):</strong> {doc.ownerNote}
            </span>
          </p>
        )}
        {children}
        {doc.lead.length > 0 && <LegalBlocks blocks={doc.lead} />}
        {doc.sections.map((section, index) => (
          <LegalSectionBlock key={section.id} section={section} number={index + 1} />
        ))}

        <div className="flex flex-col gap-3 rounded-xl border border-line bg-page px-5 py-4.5 sm:flex-row sm:items-center sm:justify-between print:hidden">
          <p className="flex flex-col leading-snug">
            <span className="font-bold text-ink">Questions about this page?</span>
            <span className="text-caption font-normal text-text">Write to us and we will explain anything that is not clear.</span>
          </p>
          <div className="flex gap-2">
            <ButtonLink href={getEmailUrl({ subject: `Question about: ${doc.title}` })} variant="secondary" icon="mail" shape="rounded">
              Email
            </ButtonLink>
            <ButtonLink href={getWhatsAppUrl(`Hello! I have a question about your ${doc.title.toLowerCase()}.`)} variant="whatsapp" icon="whatsapp" shape="rounded" isExternal>
              WhatsApp
            </ButtonLink>
          </div>
        </div>
      </article>
    </div>
  </>
);
