import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import type { GuideHelpBox } from "@ttn/config/guideHelpBox";
import Link from "next/link";

import { outlineOnDarkButton, primaryButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { trekFacts } from "@/features/home/trekFacts";
import type { HomeTrekCard } from "@/features/home/types";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";

import type { BlogTocLink } from "../types";

/** "Plan this trek": the blog's trek in one small card, and the way to it. Without a page or a phone number, only its name and facts. */
export const PlanThisTrek = async ({ trek }: { trek: HomeTrekCard }) => {
  const { phoneDisplay } = await getSiteSettings();

  return (
  <section aria-labelledby="plan-trek-h" className="flex flex-col gap-3 rounded-2xl border border-solid border-line bg-snow p-4.5">
    <div className="flex items-center gap-3">
      <span className="relative block size-16 flex-none overflow-hidden rounded-[10px] bg-forest-tint">{trek.image && <SiteImage image={{ ...trek.image, alt: "" }} sizes="64px" className="object-cover" />}</span>
      <span className="flex min-w-0 flex-col">
        <span className="text-sm leading-5 text-muted">Plan this trek</span>
        <h2 id="plan-trek-h" className="text-lg! leading-5.75!">
          {trek.name}
        </h2>
      </span>
    </div>
    <p className="text-sm leading-5 text-muted">{trekFacts(trek)}</p>
    {trek.hasPage ? (
      <Link href={trek.href} className={`${primaryButton} min-h-11!`}>
        View the trek
      </Link>
    ) : (
      phoneDisplay && (
        <a href={getWhatsAppUrl(`Hello! I would like to know about the ${trek.name}.`)} className={`${whatsAppButton} min-h-11!`}>
          <WhatsAppLogo />
          Ask about it
        </a>
      )
    )}
  </section>
  );
};

/** The help box, worded per blog in the admin; both messages start with the same words. A way left blank in Site settings is left out, and with neither so is the box. */
export const BlogHelpBox = async ({ box, blogTitle }: { box: GuideHelpBox; blogTitle: string }) => {
  const { phoneDisplay, email } = await getSiteSettings();
  if (!phoneDisplay && !email) return null;

  return (
  <section aria-labelledby="blog-help-h" className="flex flex-col gap-2 rounded-2xl bg-forest-deep p-4.5 text-snow">
    <h2 id="blog-help-h" className="text-lg! leading-5.75! text-snow!">
      {box.heading}
    </h2>
    <p className="text-[15px] leading-5.5 text-on-forest-muted">{box.text}</p>
    <div className={`mt-1 grid gap-2 ${phoneDisplay && email ? "grid-cols-2" : ""}`}>
      {phoneDisplay && (
        <a href={getWhatsAppUrl(box.message)} className={`${whatsAppButton} min-h-11! px-3!`}>
          <WhatsAppLogo />
          WhatsApp
        </a>
      )}
      {email && (
        <a href={getEmailUrl({ subject: `Question about: ${blogTitle}`, body: box.message })} className={`${outlineOnDarkButton} min-h-11! px-3!`}>
          <TrailIcon name="mail" />
          Email
        </a>
      )}
    </div>
  </section>
  );
};

/** "On this page" folded at the top of the blog, where there is no room beside it. */
export const BlogTocFolded = ({ links }: { links: readonly BlogTocLink[] }) => (
  <details className="group rounded-[14px] border border-solid border-line bg-snow lg:hidden">
    <summary className="flex min-h-13 cursor-pointer list-none items-center justify-between gap-3 px-4.5 font-semibold text-ink">
      On this page
      <TrailIcon name="chevron" size={18} className="group-open:rotate-180" />
    </summary>
    <ul className="flex flex-col px-4.5 pb-3">
      {links.map((link) => (
        <li key={link.id}>
          <a href={`#${link.id}`} className="flex min-h-10 items-center text-[15px] leading-5.5 text-text no-underline hover:text-forest">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </details>
);
