import { appEnvironment } from "@ttn/config/appEnvironment";
import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { isSectionHeading } from "@ttn/ui/lib/legalText";
import type { LegalBlock } from "@ttn/ui/lib/legalText";
import type { RichTextBlock } from "@ttn/ui/lib/richText";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/shared/JsonLd";
import { RichText } from "@/components/shared/RichText";
import { outlineButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import { legalJsonLd } from "../seo";
import type { LegalDoc } from "../types";
import { LegalHeader } from "./LegalHeader";
import { LegalSidebar } from "./LegalSidebar";

const Blocks = ({ blocks }: { blocks: readonly LegalBlock[] }) => (
  <RichText doc={{ type: "doc", content: blocks.filter((block): block is RichTextBlock => !isSectionHeading(block)) }} className="flex flex-col gap-3 text-base leading-7" />
);

type LegalPageProps = {
  doc: LegalDoc;
  /** Shown above the sections, e.g. the choices on the Cookie settings page. */
  children?: ReactNode;
};

/** A legal page: title band, side menu and the numbered document (from Pages › Legal pages). */
export const LegalPage = ({ doc, children }: LegalPageProps) => (
  <main id="main">
    <JsonLd data={legalJsonLd(doc)} />
    <LegalHeader doc={doc} />
    <div className="wrap grid items-start gap-8 pt-8 pb-16 lg:grid-cols-[260px_minmax(0,1fr)]">
      <LegalSidebar doc={doc} />
      <article className="flex min-w-0 flex-col gap-7">
        {/* For the owner only: never shown to visitors. */}
        {appEnvironment() !== "production" && doc.ownerNote && (
          <p className="rounded-[10px] border border-solid border-saffron-line bg-saffron-tint px-4 py-3 text-[15px] leading-5.5 text-saffron-ink print:hidden">
            <strong className="font-semibold">Owner note (only shown in development):</strong> {doc.ownerNote}
          </p>
        )}
        {children}
        {doc.lead.length > 0 && <Blocks blocks={doc.lead} />}
        {doc.sections.map((section, index) => (
          <section key={section.id} id={section.id} aria-labelledby={`${section.id}-h`} className="flex flex-col gap-2.5">
            <h2 id={`${section.id}-h`} className="flex items-baseline gap-2.5 text-[22px]! leading-7! max-md:text-xl! max-md:leading-6.5!">
              <span className="flex-none text-base text-forest">{index + 1}.</span>
              {section.heading}
            </h2>
            <Blocks blocks={section.blocks} />
          </section>
        ))}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] bg-stone px-5 py-4.5 print:hidden">
          <p className="flex flex-col">
            <span className="font-semibold text-ink">Questions about this page?</span>
            <span className="text-[15px] leading-5.5">Write to us and we will explain anything that is not clear.</span>
          </p>
          <div className="actions">
            <a href={getEmailUrl({ subject: `Question about: ${doc.title}` })} className={outlineButton}>
              <TrailIcon name="mail" />
              Email
            </a>
            <a href={getWhatsAppUrl(`Hello! I have a question about your ${doc.title.toLowerCase()}.`)} className={whatsAppButton}>
              <WhatsAppLogo />
              WhatsApp
            </a>
          </div>
        </div>
      </article>
    </div>
  </main>
);
