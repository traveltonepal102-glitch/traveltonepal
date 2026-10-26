import { getEmailUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { getAboutPage } from "@/features/about/services/aboutRepository";

const SIDE_AVATAR = "inline-flex size-10 items-center justify-center rounded-full border-2 border-white bg-[#d3e3f1] text-[#5e86ad]";

/** Decorative: the team as three avatars, the expert in the middle. */
const TeamAvatars = () => (
  <span aria-hidden="true" className="flex flex-none items-center">
    <span className={SIDE_AVATAR}>
      <Icon name="person" />
    </span>
    <span className="relative z-1 -ml-3 inline-flex size-12 items-center justify-center rounded-full border-2 border-brand bg-brand-tint text-brand shadow-[0_0_0_2px_#fff]">
      <Icon name="support_agent" size={26} />
    </span>
    <span className={`${SIDE_AVATAR} -ml-3`}>
      <Icon name="person" />
    </span>
  </span>
);

/** "Speak to an expert": who answers, a phone link and the office email. */
export const ExpertContact = async () => {
  const [{ contact }, { founder }] = await Promise.all([getSiteSettings(), getAboutPage()]);
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-line bg-page p-4">
      <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Speak to an expert</p>
      <div className="flex items-center gap-3.5">
        <TeamAvatars />
        <div className="flex min-w-0 flex-col">
          <p className="flex flex-wrap items-baseline gap-x-1.5">
            <span className="font-display text-body-sm font-bold text-ink">{founder?.shortName ?? "Our team"}</span>
            <span className="text-xs text-muted-foreground">{contact.officeAddress}</span>
          </p>
          <a
            href={`tel:+${contact.phoneDigits}`}
            className="inline-flex items-center gap-1 self-start rounded-sm text-xs font-semibold text-whatsapp hover:underline focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Icon name="call" size={13} />
            {contact.phoneDisplay}
          </a>
        </div>
      </div>
      <a
        href={getEmailUrl()}
        className="flex items-center justify-center gap-1.5 rounded-md border border-line bg-muted px-3 py-2.5 text-xs font-bold break-all text-ink hover:bg-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <Icon name="mail" size={17} className="flex-none text-brand" />
        Email: {contact.email}
      </a>
    </div>
  );
};
