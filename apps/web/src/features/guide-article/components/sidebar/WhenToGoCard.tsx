import { getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

/** Navy "Not sure when to go?" box: a local expert on WhatsApp. */
export const WhenToGoCard = () => (
  <section aria-labelledby="when-to-go-title" className="flex flex-col gap-2 rounded-2xl bg-navy p-4 text-white">
    <h2 id="when-to-go-title" className="text-base font-bold text-white">
      Not sure when to go?
    </h2>
    <p className="text-caption font-normal text-navy-text">
      Tell us your holiday dates and we tell you honestly what to expect on the trail.
    </p>
    <a
      href={getWhatsAppUrl("Hello! I'm not sure when to trek. My holiday dates are: ")}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1 inline-flex min-h-10 items-center gap-1.5 self-start rounded-full bg-whatsapp px-3.5 text-caption font-bold text-white hover:bg-whatsapp/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <Icon name="chat" size={16} />
      Ask a local expert
    </a>
  </section>
);
