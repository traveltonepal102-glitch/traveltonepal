import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

/**
 * BookingCard in outline, row for row: the forest head (name and price), the start date, the travellers stepper, the
 * price note, the total and the WhatsApp button.
 */
export const BookingCardSkeleton = () => (
  <div className="overflow-hidden rounded-2xl border border-line bg-snow shadow-raised">
    <div className="flex flex-col gap-1.5 bg-forest-deep px-5.5 pt-5 pb-4.5">
      <SkeletonBlock className="h-4.5 w-48 bg-white/20" />
      <SkeletonBlock className="h-10 w-36 bg-white/25" />
    </div>
    <div className="flex flex-col gap-4 px-5.5 pt-4.5 pb-5.5">
      <div className="flex flex-col gap-1.5">
        <SkeletonBlock className="h-4.5 w-20 bg-line" />
        <SkeletonBlock className="h-12 w-full rounded-[10px] border border-field bg-snow" />
        <SkeletonBlock className="h-3.5 w-48 bg-line" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <SkeletonBlock className="h-4.5 w-24 bg-line" />
        <SkeletonBlock className="h-11 w-30 rounded-[10px] border border-field bg-snow" />
      </div>
      <SkeletonBlock className="h-12 w-full rounded-[10px] bg-saffron-tint" />
      <div className="flex flex-col gap-2.5 border-t border-line pt-3.5">
        <div className="flex justify-between">
          <SkeletonBlock className="h-4.5 w-32 bg-line" />
          <SkeletonBlock className="h-4.5 w-14 bg-line" />
        </div>
        <div className="flex items-center justify-between border-t border-dashed border-line pt-2.5">
          <SkeletonBlock className="h-5 w-12 bg-field/60" />
          <SkeletonBlock className="h-7.5 w-20 bg-field/60" />
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-line pt-4">
        <SkeletonBlock className="h-12 w-full rounded-xl bg-whatsapp/25" />
        <SkeletonBlock className="mx-auto h-3.5 w-56 bg-line" />
      </div>
    </div>
  </div>
);
