import { appEnvironment } from "@ttn/config/appEnvironment";
import { isSectionHeading } from "@ttn/ui/lib/legalText";
import type { LegalBlock } from "@ttn/ui/lib/legalText";
import type { RichTextBlock } from "@ttn/ui/lib/richText";
import type { ReactNode } from "react";

import { JsonLd } from "@/components/shared/JsonLd";
import { RichText } from "@/components/shared/RichText";

import { legalJsonLd } from "../seo";
import type { LegalDoc, LegalSection } from "../types";
import { LegalHeader } from "./LegalHeader";
import { LegalSidebar } from "./LegalSidebar";

const Blocks = ({ blocks, className }: { blocks: readonly LegalBlock[]; className: string }) => (
  <RichText doc={{ type: "doc", content: blocks.filter((block): block is RichTextBlock => !isSectionHeading(block)) }} className={className} />
);

const number = (index: number) => String(index + 1).padStart(2, "0");

/** A long page's section: its number in the margin in the accent, the heading and the text beside it. */
const NumberedSection = ({ section, index }: { section: LegalSection; index: number }) => (
  <section id={section.id} aria-labelledby={`${section.id}-h`} className="grid grid-cols-[56px_minmax(0,1fr)] gap-2 border-0 border-t border-solid border-line py-8 max-sm:grid-cols-1 max-sm:gap-1">
    <span aria-hidden="true" className="font-display text-[30px] leading-8.5 font-extrabold tracking-[-0.02em] text-glacier">
      {number(index)}
    </span>
    <div className="flex min-w-0 flex-col gap-3.5">
      <h2 id={`${section.id}-h`} className="text-[26px]! leading-8! font-bold! tracking-[-0.01em]! max-md:text-[22px]! max-md:leading-7!">
        <span className="sr-only">{index + 1}. </span>
        {section.heading}
      </h2>
      <Blocks blocks={section.blocks} className="flex flex-col gap-3.5 text-[17px] leading-7.5 [--text-measure:none]" />
    </div>
  </section>
);

/** A short page's section (the Impressum): a card; one holding a table spans both columns. */
const CardSection = ({ section, index }: { section: LegalSection; index: number }) => (
  <section
    id={section.id}
    aria-labelledby={`${section.id}-h`}
    className={`flex min-w-0 flex-col gap-3 rounded-[22px] border border-solid border-ice-strong bg-snow px-7 py-6.5 ${section.blocks.some((block) => block.type === "table") ? "sm:col-span-2" : ""}`}
  >
    <h2 id={`${section.id}-h`} className="flex items-baseline gap-3 text-[21px]! leading-7! font-bold!">
      <span aria-hidden="true" className="text-[15px] font-extrabold text-glacier-ink">
        {number(index)}
      </span>
      {section.heading}
    </h2>
    <Blocks blocks={section.blocks} className="flex flex-col gap-3 text-base leading-7 [--text-measure:none]" />
  </section>
);

type LegalPageProps = {
  doc: LegalDoc;
  /** Shown above the sections, e.g. the choices on the Cookie settings page. */
  children?: ReactNode;
};

/**
 * A legal page (design: canvas "Everest Trek Website", Impressum, Datenschutz, AGB, Cookie-Einstellungen; from Pages ›
 * Legal pages): the tabbed top, then the text beside its side column. The long pages (AGB, Datenschutz) read as one
 * column with the section numbers in the margin and "Auf dieser Seite" beside it; the Impressum's short sections are
 * cards in two columns; the Cookie settings page starts with the visitor's choices.
 */
export const LegalPage = ({ doc, children }: LegalPageProps) => {
  const isLong = doc.slug === "terms" || doc.slug === "privacy";
  const isCards = doc.slug === "impressum";
  return (
    <main id="main" className="bg-snow">
      <JsonLd data={legalJsonLd(doc)} />
      <LegalHeader doc={doc} />
      <div className={`wrap grid items-start gap-12 pt-8 pb-24 lg:grid-cols-[minmax(0,1fr)_300px] ${isLong ? "lg:gap-18" : ""}`}>
        <div className={`flex min-w-0 flex-col gap-7 ${isLong ? "max-w-190" : ""}`}>
          {/* For the owner only: never shown to visitors. */}
          {appEnvironment() !== "production" && doc.ownerNote && (
            <p className="rounded-[10px] border border-solid border-glacier-line bg-glacier-tint px-4 py-3 text-[15px] leading-5.5 text-ink print:hidden">
              <strong className="font-semibold">Hinweis für den Betreiber (nur in der Entwicklung sichtbar):</strong> {doc.ownerNote}
            </p>
          )}
          {children}
          {doc.lead.length > 0 && <Blocks blocks={doc.lead} className="flex flex-col gap-3.5 text-[17px] leading-7.5" />}
          {isCards ? (
            <div className="grid gap-4.5 sm:grid-cols-2">
              {doc.sections.map((section, index) => (
                <CardSection key={section.id} section={section} index={index} />
              ))}
            </div>
          ) : (
            <article>
              {doc.sections.map((section, index) => (
                <NumberedSection key={section.id} section={section} index={index} />
              ))}
            </article>
          )}
        </div>
        <LegalSidebar doc={doc} hasToc={isLong} />
      </div>
    </main>
  );
};
