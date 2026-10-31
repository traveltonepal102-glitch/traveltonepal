import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { SectionContext } from "../../../lib/sectionContext";
import type { EditorSection } from "../../../lib/sectionDrafts";
import { AltitudeFields } from "./sections/AltitudeFields";
import { CalloutFields } from "./sections/CalloutFields";
import { ChecklistFields } from "./sections/ChecklistFields";
import { CompareTreksFields } from "./sections/CompareTreksFields";
import { CostTableFields } from "./sections/CostTableFields";
import { CtaFields } from "./sections/CtaFields";
import { EmbedFields } from "./sections/EmbedFields";
import { FaqSectionFields } from "./sections/FaqSectionFields";
import { GalleryFields } from "./sections/GalleryFields";
import { GuideWordsFields } from "./sections/GuideWordsFields";
import { HeadingFields } from "./sections/HeadingFields";
import { HtmlFields } from "./sections/HtmlFields";
import { ItineraryDaysFields } from "./sections/ItineraryDaysFields";
import { MapFields } from "./sections/MapFields";
import { MeetGuidesFields } from "./sections/MeetGuidesFields";
import { MonthsFields } from "./sections/MonthsFields";
import { ParagraphFields } from "./sections/ParagraphFields";
import { PhotoFields } from "./sections/PhotoFields";
import { QuickAnswerFields } from "./sections/QuickAnswerFields";
import { QuoteFields } from "./sections/QuoteFields";
import { TableFields } from "./sections/TableFields";
import { TextSectionFields } from "./sections/TextSectionFields";
import { TrekCardFields } from "./sections/TrekCardFields";
import { VideoFields } from "./sections/VideoFields";

type SectionFieldsProps = {
  section: EditorSection;
  /** Its place in the body (0 first), for its errors ("sections.<index>.…"). */
  index: number;
  context: SectionContext;
  errors: FieldErrors;
  onChange: (section: EditorSection) => void;
};

/** The fields of one section, by kind. */
export const SectionFields = ({ section, index, context, errors, onChange }: SectionFieldsProps) => {
  const field = `sections.${index}`;
  const shared = { field, errors };
  switch (section.type) {
    case "text":
      return <TextSectionFields section={section} {...shared} onChange={(patch) => onChange({ ...section, ...patch })} />;
    case "paragraph":
      return <ParagraphFields body={section.body} error={errors[`${field}.body`]} onChange={(body) => onChange({ ...section, body })} />;
    case "heading":
      return <HeadingFields section={section} {...shared} onChange={(patch) => onChange({ ...section, ...patch })} />;
    case "quick":
      return <QuickAnswerFields body={section.body} error={errors[`${field}.body`]} onChange={(body) => onChange({ ...section, body })} />;
    case "callout":
      return <CalloutFields tone={section.tone} body={section.body} error={errors[`${field}.body`]} onChange={(patch) => onChange({ ...section, ...patch })} />;
    case "check":
      return <ChecklistFields heading={section.heading} items={section.items} {...shared} onChange={(patch) => onChange({ ...section, ...patch })} />;
    case "table":
      return <TableFields table={section} {...shared} onChange={(patch) => onChange({ ...section, ...patch })} />;
    case "html":
      return <HtmlFields html={section.html} error={errors[`${field}.html`]} onChange={(html) => onChange({ ...section, html })} />;
    case "quote":
      return <QuoteFields text={section.text} error={errors[`${field}.text`]} onChange={(text) => onChange({ ...section, text })} />;
    case "trek":
      return <TrekCardFields trekId={section.trekId} treks={context.treks} error={errors[`${field}.trekId`]} onChange={(trekId) => onChange({ ...section, trekId })} />;
    case "months":
      return (
        <MonthsFields
          heading={section.heading}
          view={section.view}
          months={context.months}
          {...shared}
          onChange={(patch) => onChange({ ...section, ...patch })}
          onMonthsChange={context.onMonthsChange}
        />
      );
    case "days":
      return <ItineraryDaysFields trekId={section.trekId} dayIds={section.dayIds} treks={context.treks} {...shared} onChange={(patch) => onChange({ ...section, ...patch })} />;
    case "altitude":
      return <AltitudeFields trekId={section.trekId} heading={section.heading} treks={context.treks} {...shared} onChange={(patch) => onChange({ ...section, ...patch })} />;
    case "cost":
      return (
        <CostTableFields heading={section.heading} rows={section.rows} totalLabel={section.totalLabel} total={section.total} {...shared} onChange={(patch) => onChange({ ...section, ...patch })} />
      );
    case "compare":
      return <CompareTreksFields trekIds={section.trekIds} treks={context.treks} {...shared} onChange={(trekIds) => onChange({ ...section, trekIds })} />;
    case "tip":
    case "gquote":
      return <GuideWordsFields kind={section.type} guideId={section.guideId} text={section.text} context={context} {...shared} onChange={(patch) => onChange({ ...section, ...patch })} />;
    case "meet":
      return <MeetGuidesFields heading={section.heading} guideIds={section.guideIds} context={context} {...shared} onChange={(patch) => onChange({ ...section, ...patch })} />;
    case "image":
      return <PhotoFields photoId={section.photoId} caption={section.caption} alt={section.alt} context={context} {...shared} onChange={(patch) => onChange({ ...section, ...patch })} />;
    case "gallery":
      return <GalleryFields photoIds={section.photoIds} context={context} {...shared} onChange={(photoIds) => onChange({ ...section, photoIds })} />;
    case "map":
      return <MapFields title={section.title} place={section.place} {...shared} onChange={(patch) => onChange({ ...section, ...patch })} />;
    case "embed":
      return <EmbedFields code={section.code} height={section.height} title={section.title} caption={section.caption} {...shared} onChange={(patch) => onChange({ ...section, ...patch })} />;
    case "video":
      return <VideoFields youtubeId={section.youtubeId} title={section.title} {...shared} onChange={(patch) => onChange({ ...section, ...patch })} />;
    case "cta":
      return <CtaFields heading={section.heading} buttonText={section.buttonText} message={section.message} {...shared} onChange={(patch) => onChange({ ...section, ...patch })} />;
    case "faq":
      return <FaqSectionFields items={section.items} {...shared} onChange={(items) => onChange({ ...section, items })} />;
  }
};
