import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

const GROUP_ROWS = [1, 2, 3, 4, 5] as const;

/**
 * BookingCard in outline, row for row: the trek and its price in the middle, the group sizes on cream (radio buttons
 * with dotted leaders), the start date, the two booking buttons and the note under them.
 */
export const BookingCardSkeleton = () => (
  <div className="flex flex-col gap-3.5 rounded-3xl border border-line bg-snow px-5.5 py-6 shadow-raised">
    <SkeletonBlock className="mx-auto h-4.5 w-48 bg-line" />
    <div className="flex flex-col items-center">
      <div className="flex h-11 items-center">
        <SkeletonBlock className="h-9 w-52 bg-field/60" />
      </div>
      <SkeletonBlock className="h-5 w-44 bg-line" />
    </div>
    <div className="flex flex-col rounded-xl bg-cream px-2.5 pt-3 pb-2">
      <div className="flex justify-between border-b-[1.5px] border-maroon/30 px-2 pb-2">
        <SkeletonBlock className="h-5 w-36 bg-line" />
        <SkeletonBlock className="h-5 w-28 bg-line" />
      </div>
      <div className="flex flex-col pt-1">
        {GROUP_ROWS.map((row) => (
          <div key={row} className="flex min-h-11 items-center gap-2.5 px-2">
            <SkeletonBlock className="size-5 flex-none rounded-full bg-snow" />
            <SkeletonBlock className="h-4.5 w-24 bg-line" />
            <span className="flex-1" />
            <SkeletonBlock className="h-4.5 w-16 bg-line" />
          </div>
        ))}
      </div>
      <SkeletonBlock className="mx-2 mt-1.5 h-4 w-44 bg-line" />
    </div>
    <div className="flex flex-col gap-1.5">
      <SkeletonBlock className="h-5 w-20 bg-line" />
      <SkeletonBlock className="h-12 w-full rounded-[10px] border border-field bg-snow" />
      <SkeletonBlock className="h-4.5 w-56 bg-line" />
    </div>
    <div className="flex flex-col gap-2">
      <SkeletonBlock className="h-12 w-full rounded-full bg-whatsapp/25" />
      <SkeletonBlock className="h-12 w-full rounded-full border border-maroon/40 bg-snow" />
      <SkeletonBlock className="mx-auto h-4.5 w-64 bg-line" />
    </div>
  </div>
);
