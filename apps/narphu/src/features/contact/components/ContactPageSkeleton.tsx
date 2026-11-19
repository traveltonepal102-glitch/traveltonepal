import { PageLoading } from "@/components/shared/PageLoading";
import { SkeletonPageTop } from "@/components/shared/skeleton/SkeletonParts";
import { SkeletonBlock } from "@/components/ui/SkeletonBlock";

const FIELDS = [1, 2, 3, 4] as const;
const DETAILS = [1, 2, 3, 4] as const;

/** The Contact page in outline: the stone top, the request form beside the ways to reach us. */
export const ContactPageSkeleton = () => (
  <PageLoading>
    <SkeletonPageTop introLines={3} />

    <div className="wrap grid gap-8 py-10 md:py-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
      {/* ContactForm */}
      <div className="flex flex-col gap-5 rounded-2xl border border-line bg-snow p-6 shadow-card md:p-8">
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-9 w-1/2 bg-field/60" />
          <SkeletonBlock className="h-5 w-4/5 bg-line" />
        </div>
        <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <div key={field} className="flex flex-col gap-1.5">
              <SkeletonBlock className="h-4 w-24 bg-line" />
              <SkeletonBlock className="h-12 w-full rounded-[10px] bg-line" />
            </div>
          ))}
        </div>
        <SkeletonBlock className="h-32 w-full rounded-[10px] bg-line" />
        <SkeletonBlock className="h-12 w-48 rounded-[10px] bg-maroon/25" />
      </div>

      {/* ContactDetails: a stone card */}
      <div className="flex flex-col gap-2 self-start rounded-2xl bg-cream p-6 md:p-8">
        <SkeletonBlock className="mb-2 h-9 w-1/2 bg-field/60" />
        <div className="flex flex-col divide-y divide-line">
          {DETAILS.map((detail) => (
            <div key={detail} className="flex items-start gap-3.5 py-4.5 first:pt-0 last:pb-0">
              <SkeletonBlock className="size-10 flex-none rounded-[10px] bg-line" />
              <div className="flex w-full flex-col gap-1.5">
                <SkeletonBlock className="h-4 w-1/4 bg-line" />
                <SkeletonBlock className="h-5 w-3/5 bg-field/60" />
                <SkeletonBlock className="h-4 w-1/2 bg-line" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </PageLoading>
);
