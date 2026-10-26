import { getEmailUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { trekInquiryUrl } from "@/features/treks/inquiry";

const BUTTON =
  "inline-flex min-h-11.5 flex-wrap items-center justify-center gap-x-2 rounded-xl px-5 py-2 text-center text-xs font-bold tracking-wider uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring max-sm:w-full";

const PROMISES = [
  { icon: "check_circle", text: "Prompt 1-to-1 local advice", className: "text-whatsapp" },
  { icon: "check_circle", text: "Free itinerary discussion", className: "text-whatsapp" },
  { icon: "schedule", text: "Fast reply on WhatsApp", className: "text-saffron-deep" },
] as const;

/** "Direct local consultation": ask the team personally on WhatsApp (about this trek) or by email. */
export const DirectConsultationCard = async ({ trekName }: { trekName: string }) => {
  const { contact } = await getSiteSettings();
  return (
    <section
      aria-labelledby="consultation-title"
      className="flex flex-col gap-4 rounded-lg border border-saffron-line bg-linear-45 from-white via-saffron-tint via-55% to-page p-4.5 shadow-card md:p-6"
    >
      <div className="flex flex-col gap-1.5">
        <p className="inline-flex items-center gap-2 text-eyebrow text-saffron-ink uppercase">
          <Icon name="support_agent" />
          Direct local consultation
        </p>
        <h2 id="consultation-title" className="text-h3 font-extrabold">
          Do you have any specific questions that you want to ask us personally?
        </h2>
        <p className="text-body-sm text-text">
          Message us on WhatsApp or send us an email. Either I or my team will personally answer your questions and make
          sure all your doubts are answered properly.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <a
          href={trekInquiryUrl({ name: trekName })}
          target="_blank"
          rel="noopener noreferrer"
          className={`${BUTTON} bg-whatsapp text-white shadow-card hover:bg-whatsapp/90`}
        >
          <Icon name="chat" size={18} />
          Chat on WhatsApp ({contact.phoneDisplay})
        </a>
        <a href={getEmailUrl()} className={`${BUTTON} border border-line-strong bg-surface text-ink hover:bg-page`}>
          <Icon name="mail" size={18} className="text-brand" />
          Email us directly
          {/* The address keeps its own case and may wrap on narrow phones. */}
          <span className="tracking-normal break-all normal-case">({contact.email})</span>
        </a>
      </div>

      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-saffron-line pt-2.5 text-xs font-medium text-text">
        {PROMISES.map((promise) => (
          <li key={promise.text} className="inline-flex items-center gap-1.5">
            <Icon name={promise.icon} size={15} className={promise.className} />
            {promise.text}
          </li>
        ))}
      </ul>
    </section>
  );
};
