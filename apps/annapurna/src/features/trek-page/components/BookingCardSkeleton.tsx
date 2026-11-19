import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

const GROUP_ROWS = [1, 2, 3, 4] as const;

/**
 * BookingCard in outline, row for row: the white head (name, price, note), the start date, the prices by group size
 * (GroupPriceTable), the WhatsApp and e-mail buttons and the note under them.
 */
export const BookingCardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-line bg-snow shadow-raised">
    <div className="flex flex-col gap-1 border-b border-line px-5.5 pt-5 pb-4">
      <SkeletonBlock className="h-5 w-36 bg-line" />
      <div className="flex h-12 items-center">
        <SkeletonBlock className="h-10 w-44 bg-field/60" />
      </div>
      <SkeletonBlock className="h-4.5 w-52 bg-line" />
    </div>
    <div className="flex flex-col gap-4 px-5.5 pt-4.5 pb-5.5">
      <div className="flex flex-col gap-1.5">
        <SkeletonBlock className="h-5 w-24 bg-line" />
        <SkeletonBlock className="h-12 w-full rounded-[10px] border border-field bg-snow" />
        <SkeletonBlock className="h-4.5 w-64 bg-line" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <SkeletonBlock className="h-5 w-40 bg-line" />
          <SkeletonBlock className="h-4.5 w-16 bg-line" />
        </div>
        <div className="flex flex-col gap-1.5">
          {GROUP_ROWS.map((row) => (
            <SkeletonBlock key={row} className="h-11 w-full rounded-[10px] border border-line bg-snow" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-line pt-4">
        <SkeletonBlock className="h-12 w-full rounded-[10px] bg-whatsapp/25" />
        <SkeletonBlock className="h-12 w-full rounded-[10px] border border-field bg-snow" />
        <SkeletonBlock className="mx-auto h-4.5 w-64 bg-line" />
      </div>
    </div>
  </div>
);
