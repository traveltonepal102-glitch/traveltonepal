import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

/** "Planning a trek?" band at the top of the footer (design: Main.dc.html), with WhatsApp and email. */
export const FooterContactBand = () => (
  <div className="border-b border-white/10">
    <div className="mx-auto flex max-w-content items-center justify-between gap-5 px-4 py-7 max-md:flex-col max-md:items-start md:px-6">
      <div className="flex items-center gap-3.5">
        <span className="inline-flex size-11 flex-none items-center justify-center rounded-lg bg-whatsapp/18 text-whatsapp-on-dark">
          <Icon name="chat" size={24} />
        </span>
        <div>
          <p className="font-display text-h3 text-white">Planning a trek? Ask a local expert on WhatsApp or email.</p>
          <p className="text-footer-muted">We usually reply within a few hours, Nepal time.</p>
        </div>
      </div>
      <div className="flex flex-none flex-wrap gap-2.5 max-md:w-full">
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12 flex-none items-center justify-center gap-2.5 rounded-full bg-whatsapp px-5.5 font-bold whitespace-nowrap text-white transition-colors hover:bg-whatsapp/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white max-md:w-full"
        >
          <WhatsAppLogo />
          Plan my trek on WhatsApp
        </a>
        <a
          href={getEmailUrl()}
          className="inline-flex min-h-12 flex-none items-center justify-center gap-2.5 rounded-full border border-white/35 px-5.5 font-bold whitespace-nowrap text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white max-md:w-full"
        >
          <Icon name="mail" size={20} />
          Email us
        </a>
      </div>
    </div>
  </div>
);
