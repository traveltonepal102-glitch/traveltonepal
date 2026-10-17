import { Icon } from "@ttn/ui/icon";
import Image from "next/image";

const INQUIRY = `Hi! I'd like to inquire about this trek:
Trek: Langtang Valley Trek – 10 days
Group size: 3–5 people
Dates: flexible, April 2027
My name: Anna`;

/** Example WhatsApp chat (design: Main.dc.html, "How booking works"). An illustration, not a live chat. */
export const ChatPreview = () => (
  <figure className="w-full max-w-105 rounded-xl bg-brand-tint p-4 shadow-popover">
    <figcaption className="sr-only">Example of a trek inquiry and reply on WhatsApp</figcaption>

    <div className="flex items-center gap-3 border-b border-line px-1.5 pt-1.5 pb-3.5">
      <span className="inline-flex size-11.5 flex-none items-center justify-center rounded-full bg-surface">
        <Image src="/brand/logo-mark.svg" alt="" width={15} height={30} className="h-7.5 w-auto" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-bold text-ink">Travel To Nepal</span>
        <span className="text-caption font-semibold text-whatsapp">Trek consultant</span>
      </span>
    </div>

    <div className="flex flex-col gap-2.5 pt-3.5 text-body-sm text-ink">
      <p className="max-w-[90%] self-end rounded-lg rounded-br-sm bg-green-line px-3.5 py-3 whitespace-pre-line">
        {INQUIRY}
      </p>
      <p className="max-w-[90%] self-start rounded-lg rounded-bl-sm bg-surface px-3.5 py-3">
        Namaste Anna! Here is the day-by-day plan and the price for your group. Which week in April suits you best?
      </p>
      <p className="inline-flex items-center gap-2.5 self-start rounded-lg bg-surface px-3 py-2.5 font-semibold">
        <span className="inline-flex size-9 items-center justify-center rounded-md bg-brand text-white">
          <Icon name="description" />
        </span>
        Langtang-itinerary-10-days.pdf
      </p>
    </div>
  </figure>
);
