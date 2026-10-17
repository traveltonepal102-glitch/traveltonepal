import { getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";

import { ButtonLink } from "@/components/ui/ButtonLink";

import { ChatPreview } from "./ChatPreview";

type Step = { icon: IconName; title: string; text: string };

/** Static in code (TRD: home content lives in code, not the admin). */
const STEPS: readonly Step[] = [
  { icon: "search", title: "Pick a trek, or just an idea", text: "Browse by region, length and season, or tell us what you have in mind." },
  {
    icon: "chat",
    title: "Message us on WhatsApp",
    text: "Your trek, group size and dates are already filled in. A consultant replies with an itinerary and price.",
  },
  { icon: "hiking", title: "Confirm and pack your boots", text: "We arrange permits, domestic flights, guides and porters." },
];

/** "How booking works" (design: Main.dc.html): three steps and a WhatsApp button, next to an example chat. */
export const HowBookingWorksSection = () => (
  <section aria-labelledby="how-booking-title" className="py-16 md:py-24">
    <div className="mx-auto flex max-w-content flex-wrap items-center gap-12 px-4 md:px-6">
      <div className="flex grow basis-95 flex-col gap-6.5">
        <div className="flex flex-col gap-2.5">
          <p className="inline-flex items-center gap-2 text-eyebrow text-brand uppercase">
            <Icon name="route" size={18} />
            How booking works
          </p>
          <h2 id="how-booking-title" className="text-h2 tracking-tight md:text-h1">
            Plan it in a chat, not a form.
          </h2>
        </div>

        <ol>
          {STEPS.map((step, index) => (
            <li key={step.title} className="group flex gap-4.5">
              {/* Icon, then a dashed line down to the next step (none after the last). */}
              <div className="flex flex-col items-center">
                <span className="inline-flex size-13 flex-none items-center justify-center rounded-lg bg-brand text-white">
                  <Icon name={step.icon} size={26} />
                </span>
                <span aria-hidden="true" className="min-h-6 grow border-l-2 border-dashed border-chart-3 group-last:hidden" />
              </div>
              <div className="flex flex-col gap-1 pb-6 group-last:pb-0">
                <p className="text-eyebrow text-brand uppercase">Step {index + 1}</p>
                <h3 className="text-h3">{step.title}</h3>
                <p className="text-text">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <ButtonLink
          href={getWhatsAppUrl()}
          variant="whatsapp"
          size="lg"
          icon="chat"
          isExternal
          className="self-start max-md:w-full"
        >
          Start a chat on WhatsApp
        </ButtonLink>
      </div>

      <div className="flex grow basis-85 justify-center">
        <ChatPreview />
      </div>
    </div>
  </section>
);
