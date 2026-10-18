import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ROUTES } from "@/lib/routes";

import { GuideSearchForm } from "./GuideSearchForm";
import { WRAP } from "./styles";

/** Travel guides page header: breadcrumb, title and intro, with the guide search on the right. */
export const GuidesHero = () => (
  <section aria-labelledby="guides-title" className="border-b border-line bg-surface">
    <div className={`${WRAP} flex flex-col gap-4 pt-5.5 pb-9 md:pb-10`}>
      <Breadcrumbs items={[{ label: "Home", href: ROUTES.home }, { label: "Travel guides" }]} />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-14">
        <div className="flex max-w-205 flex-col gap-3">
          <p className="text-eyebrow text-brand uppercase">Written by our local team</p>
          <h1 id="guides-title" className="text-h1-sm tracking-tight md:text-h1">
            Nepal travel guides
          </h1>
          <p className="text-body-lg text-text">
            Honest, practical advice for planning a trek in Nepal: permits, seasons, costs, altitude and what to pack,
            from the people who walk these trails every season.
          </p>
        </div>
        <GuideSearchForm />
      </div>
    </div>
  </section>
);
