import { getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { WRAP } from "./styles";

const MESSAGE = "Hello! I am deciding which region of Nepal to trek in. Could you suggest one for my dates and fitness?";

/** "Still deciding between regions?": free advice from a local expert on WhatsApp. */
export const RegionsCta = () => (
  <section aria-labelledby="regions-cta-title" className="pb-14">
    <div className={WRAP}>
      <div className="flex flex-col items-stretch gap-5 rounded-xl border border-saffron-line bg-linear-135 from-saffron-tint to-white to-65% p-4.5 sm:flex-row sm:items-center sm:justify-between md:p-7">
        <div className="flex max-w-155 flex-col gap-1.5">
          <h2 id="regions-cta-title" className="text-2xl font-extrabold">
            Still deciding between regions?
          </h2>
          <p className="text-body-sm text-text">
            Tell us your dates, fitness and what you want to see. A local expert suggests the right region and trek, free.
          </p>
        </div>
        <a
          href={getWhatsAppUrl(MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-12.5 flex-none items-center justify-center gap-2 rounded-xl bg-whatsapp px-5.5 text-caption font-bold tracking-wider text-white uppercase hover:bg-whatsapp/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Icon name="chat" size={18} />
          Ask a local expert
        </a>
      </div>
    </div>
  </section>
);
