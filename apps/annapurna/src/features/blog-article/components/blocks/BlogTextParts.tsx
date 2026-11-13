import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import type { RichTextDoc } from "@ttn/ui/lib/richText";

import { RichText } from "@/components/shared/RichText";
import { outlineButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";

const CALLOUT = {
  note: { box: "border-line bg-cloud", icon: "doc", iconColor: "text-navy", label: "Good to know" },
  warning: { box: "border-cream-line bg-cream", icon: "shield", iconColor: "text-cream-ink", label: "Take care" },
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
          <span className="mt-0.75 inline-flex size-5 flex-none items-center justify-center rounded-full bg-navy text-snow">
            <TrailIcon name="check" size={13} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  </section>
);

/** A question to us in the middle of the blog: the admin's words start the WhatsApp message. Left out without a number in Site settings. */
/** "Ask us" in the middle of a blog: the heading typed in the editor, who answers, WhatsApp and email (each only with its detail in Site settings). */
export const BlogCta = async ({ heading, buttonText, message }: { heading: string; buttonText: string; message: string }) => {
  const { phoneDisplay, email } = await getSiteSettings();
  if (!phoneDisplay && !email) return null;

  return (
    <aside aria-label={heading} className="flex flex-wrap items-center gap-x-8 gap-y-5 rounded-2xl border border-solid border-line bg-cloud p-6 md:p-7">
      <span aria-hidden="true" className="inline-flex size-14 flex-none items-center justify-center rounded-2xl bg-whatsapp text-snow">
        <WhatsAppLogo size={28} />
      </span>
      <div className="flex min-w-0 flex-[1_1_300px] flex-col gap-1">
        <span className="eyebrow">Ask our team</span>
        <p className="font-display text-[22px] leading-7.5 font-bold text-ink">{heading}</p>
        <p className="text-[15px] leading-5.75 text-muted">A guide from our team answers you personally, usually within a few hours.</p>
      </div>
      <div className="actions max-sm:w-full">
        {phoneDisplay && (
          <a href={getWhatsAppUrl(message)} rel="nofollow" className={whatsAppButton}>
            <WhatsAppLogo />
            {buttonText}
          </a>
        )}
        {email && (
          <a href={getEmailUrl({ subject: heading, body: message })} rel="nofollow" className={outlineButton}>
            <TrailIcon name="mail" />
            Email us
          </a>
        )}
      </div>
    </aside>
  );
};

export const BlogQuote = ({ text }: { text: string }) => (
  <blockquote className="border-0 border-l-4 border-solid border-sun py-1 pl-5">
    <p className="font-display text-2xl leading-8.5 font-semibold text-navy-deep">“{text}”</p>
  </blockquote>
);
