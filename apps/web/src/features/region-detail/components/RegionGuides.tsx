import { Icon } from "@ttn/ui/icon";
import Image from "next/image";

import { getGuides } from "@/features/team/guides";
import { ABOUT_PATHS } from "@/lib/navigation";

import { RegionSectionHeading } from "./RegionSectionHeading";
import { WRAP } from "./styles";

type RegionGuidesProps = { regionName: string; guideIds: readonly string[] };

/** "Your guides": the team's guides from this region, on a navy band. */
export const RegionGuides = ({ regionName, guideIds }: RegionGuidesProps) => {
  const guides = getGuides(guideIds);
  if (guides.length === 0) return null;

  return (
    <section id="guides" aria-labelledby="region-guides-title" className="scroll-mt-14 bg-navy py-14 text-white">
      <div className={`${WRAP} flex flex-col gap-6`}>
        <RegionSectionHeading
          id="region-guides-title"
          kicker="Your guides"
          title={`Guides who grew up in ${regionName}`}
          link={{ href: ABOUT_PATHS.team, label: "Meet the whole team" }}
          tone="dark"
        />
        <ul className="grid gap-4.5 md:grid-cols-2 xl:grid-cols-3">
          {guides.map((guide) => (
            <li key={guide.id} className="flex flex-col gap-3 rounded-lg border border-white/14 bg-white/6 p-5.5">
              <div className="flex items-center gap-3.5">
                <span className="relative inline-flex size-16 flex-none items-center justify-center overflow-hidden rounded-full bg-brand-tint text-brand">
                  {guide.photo ? (
                    <Image src={guide.photo.src} alt={guide.photo.alt} fill sizes="64px" className="object-cover" />
                  ) : (
                    <Icon name="person" size={30} />
                  )}
                </span>
                <div>
                  <h3 className="flex items-center gap-1.5 text-lg font-bold text-white">
                    {guide.name}
                    <Icon name="verified" size={16} label="Licensed guide" className="text-whatsapp-on-dark" />
                  </h3>
                  <p className="text-caption font-normal text-navy-text">
                    {guide.role} · {guide.experience}
                  </p>
                </div>
              </div>
              <blockquote className="font-display text-base leading-snug font-semibold text-white">“{guide.quote}”</blockquote>
              <p className="inline-flex items-center gap-1.5 text-caption font-normal text-navy-text">
                <Icon name="translate" size={16} className="text-saffron" />
                {guide.languages.join(", ")}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
