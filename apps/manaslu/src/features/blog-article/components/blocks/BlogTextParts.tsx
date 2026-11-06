import { getWhatsAppUrl } from "@ttn/config/contact";
import type { RichTextDoc } from "@ttn/ui/lib/richText";

import { RichText } from "@/components/shared/RichText";
import { whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";

const CALLOUT = {
  note: { box: "border-line bg-stone", icon: "doc", iconColor: "text-forest", label: "Good to know" },
  warning: { box: "border-saffron-line bg-saffron-tint", icon: "shield", iconColor: "text-saffron-ink", label: "Take care" },
} as const;

/** A note or a warning, with its label for those who can't see the colour. */
export const BlogCallout = ({ tone, body }: { tone: "note" | "warning"; body: RichTextDoc }) => {
  const { box, icon, iconColor, label } = CALLOUT[tone];
  return (
    <aside aria-label={label} className={`flex gap-3 rounded-[14px] border border-solid p-4.5 ${box}`}>
      <TrailIcon name={icon} size={22} className={`mt-0.5 flex-none ${iconColor}`} />
      <div className="flex min-w-0 flex-col gap-1">
        <p className="font-semibold text-ink">{label}</p>
        <RichText doc={body} className="flex flex-col gap-2.5 text-base leading-6.5" />
      </div>
    </aside>
  );
};

/** A checklist in its own card. */
export const BlogChecklist = ({ heading, items }: { heading: string; items: readonly string[] }) => (
  <section aria-label={heading || "Checklist"} className="flex flex-col gap-3 rounded-2xl border border-solid border-line p-5">
    {heading && <h3 className="text-xl! leading-6.5!">{heading}</h3>}
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-base leading-6.5">
          <span className="mt-0.75 inline-flex size-5 flex-none items-center justify-center rounded-full bg-forest text-snow">
            <TrailIcon name="check" size={13} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  </section>
);

/** A question to us in the middle of the blog: the admin's words start the WhatsApp message. Left out without a number in Site settings. */
export const BlogCta = async ({ heading, buttonText, message }: { heading: string; buttonText: string; message: string }) => {
  const { phoneDisplay } = await getSiteSettings();
  if (!phoneDisplay) return null;

  return (
    <aside aria-label={heading} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-forest-deep p-5 md:p-6">
      <p className="max-w-[40ch] font-display text-[22px] leading-7.5 font-semibold text-snow">{heading}</p>
      <a href={getWhatsAppUrl(message)} className={whatsAppButton}>
        <WhatsAppLogo />
        {buttonText}
      </a>
    </aside>
  );
};

export const BlogQuote = ({ text }: { text: string }) => (
  <blockquote className="border-0 border-l-4 border-solid border-saffron py-1 pl-5">
    <p className="font-display text-2xl leading-8.5 font-semibold text-forest-deep">“{text}”</p>
  </blockquote>
);
