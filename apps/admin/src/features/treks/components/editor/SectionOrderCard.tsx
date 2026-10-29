"use client";

import { isFullWidthTrekSection } from "@ttn/config/trekPageSections";
import type { TrekPageSection } from "@ttn/config/trekPageSections";
import { Icon } from "@ttn/ui/icon";

import { ghostIconButton } from "@/components/ui/buttonStyles";
import { FormSection } from "@/components/ui/FormSection";
import { DragHandle, SortableList } from "@/components/ui/SortableList";

import { TREK_PAGE_SECTION_INFO } from "../../pageSections";

type SectionOrderCardProps = {
  order: TrekPageSection[];
  onChange: (order: TrekPageSection[]) => void;
};

type OrderListProps = {
  title: string;
  hint: string;
  sections: TrekPageSection[];
  onReorder: (sections: TrekPageSection[]) => void;
};

const move = <Item,>(items: Item[], from: number, to: number) => {
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
};

/** One group of sections: drag a row by its handle, or use its arrows. */
const OrderList = ({ title, hint, sections, onReorder }: OrderListProps) => {
  const reorder = (from: number, to: number) => onReorder(move(sections, from, to));

  return (
    <FormSection title={title} hint={hint}>
      <SortableList
        items={sections.map((section) => ({ key: section }))}
        itemLabel={({ key }) => TREK_PAGE_SECTION_INFO[key].label}
        onMove={reorder}
        className="gap-1.5"
      >
        {({ key }, index, handle) => {
          const info = TREK_PAGE_SECTION_INFO[key];
          return (
            <div className="flex items-center gap-2.5 rounded-md border border-solid border-border bg-surface py-1.5 pr-1.5 pl-1">
              <DragHandle {...handle} />
              <span className="w-5 flex-none text-right text-xs font-bold text-subtle">{index + 1}</span>
              <span className="inline-flex size-8 flex-none items-center justify-center rounded-[9px] bg-brand-tint text-brand">
                <Icon name={info.icon} size={18} />
              </span>
              <span className="min-w-0 flex-1 font-bold text-ink">{info.label}</span>
              {"sharedKey" in info && (
                <span className="rounded-full bg-page px-2.5 py-0.5 text-xs font-bold whitespace-nowrap text-muted-foreground max-tablet:hidden">
                  Shared by every trek
                </span>
              )}
              <div className="flex gap-0.5">
                <button type="button" className={ghostIconButton} aria-label={`Move ${info.label} up`} disabled={index === 0} onClick={() => reorder(index, index - 1)}>
                  <Icon name="arrow_upward" size={18} />
                </button>
                <button
                  type="button"
                  className={ghostIconButton}
                  aria-label={`Move ${info.label} down`}
                  disabled={index === sections.length - 1}
                  onClick={() => reorder(index, index + 1)}
                >
                  <Icon name="arrow_downward" size={18} />
                </button>
              </div>
            </div>
          );
        }}
      </SortableList>
    </FormSection>
  );
};

/**
 * The order of the trek page's sections (every heading, the shared ones too). The photos always open the page;
 * the sections beside the booking card and the full-width ones at the end each move among themselves. Sent as
 * sectionOrder, in order.
 */
export const SectionOrderCard = ({ order, onChange }: SectionOrderCardProps) => {
  const main = order.filter((section) => !isFullWidthTrekSection(section));
  const fullWidth = order.filter(isFullWidthTrekSection);

  return (
    <>
      {order.map((section) => (
        <input key={section} type="hidden" name="sectionOrder" value={section} />
      ))}
      <OrderList
        title="Beside the booking card"
        hint="Under the photos, from top to bottom. A section with nothing to show, or switched off, is left out."
        sections={main}
        onReorder={(next) => onChange([...next, ...fullWidth])}
      />
      <OrderList
        title="Full width, at the end of the page"
        hint="After the booking card, from top to bottom."
        sections={fullWidth}
        onReorder={(next) => onChange([...main, ...next])}
      />
    </>
  );
};
