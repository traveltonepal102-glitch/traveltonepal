import { CONTACT, getEmailUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { trekCustomizeUrl } from "@/features/treks/inquiry";

import type { TrekDetail } from "../../types";
import { CARD_TITLE } from "../styles";

/** Chip colors, used in turn: blue, saffron, green, navy (as in the design). */
const CHIP_TONES = [
  { chip: "border-brand/15 bg-brand-tint text-navy", icon: "text-brand" },
  { chip: "border-saffron-line bg-saffron-tint text-saffron-ink", icon: "text-saffron-deep" },
  { chip: "border-green-line bg-green-tint text-whatsapp", icon: "text-whatsapp" },
  { chip: "border-navy/15 bg-navy/10 text-navy", icon: "text-navy" },
] as const;

const BUTTON =
  "flex min-h-12.5 items-center justify-center gap-2 rounded-xl px-5 text-center text-caption font-bold tracking-wider uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

type CustomItineraryCardProps = Pick<TrekDetail, "name" | "customization">;

/** "Custom itinerary and private changes": the trip can be reshaped as often as needed, free. */
export const CustomItineraryCard = ({ name, customization }: CustomItineraryCardProps) => (
  <div className="mt-3 flex flex-col gap-5 rounded-xl border border-saffron-line bg-linear-135 from-saffron-tint to-white to-60% p-4.5 shadow-card md:p-7">
    <div className="flex flex-wrap items-center justify-between gap-2.5">
      <p className="inline-flex items-center gap-1.5 rounded-full border border-saffron-line bg-saffron/30 px-3 py-1 text-[11px] font-extrabold tracking-[0.06em] text-ink uppercase">
        <Icon name="tune" size={15} className="text-saffron-deep" />
        Tailor-made treks
      </p>
      <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-whatsapp">
        <Icon name="check_circle" size={16} />
        Unlimited free changes until it is right
      </p>
    </div>

    <div className="flex flex-col gap-2">
      <h3 className={CARD_TITLE}>Custom itinerary and private changes</h3>
      <p className="text-body text-text">{customization.pitch}</p>
    </div>

    <ul className="flex flex-wrap gap-2">
      {customization.options.map((option, index) => {
        const tone = CHIP_TONES[index % CHIP_TONES.length];
        return (
          <li
            key={option.label}
            className={`inline-flex items-center gap-1.5 rounded-full border py-1.5 pr-3.5 pl-2 text-caption font-semibold ${tone.chip}`}
          >
            <Icon name={option.icon} size={16} className={`flex-none ${tone.icon}`} />
            {option.label}
          </li>
        );
      })}
    </ul>

    <div className="flex flex-col gap-2.5 border-t border-saffron-line pt-4.5">
      <div className="grid gap-3 sm:grid-cols-2">
        <a
          href={trekCustomizeUrl({ name })}
          target="_blank"
          rel="noopener noreferrer"
          className={`${BUTTON} bg-whatsapp text-white shadow-[0_4px_10px_rgba(21,128,61,0.2)] hover:bg-whatsapp/90`}
        >
          <Icon name="chat" size={18} />
          Customize on WhatsApp
        </a>
        <a href={getEmailUrl()} className={`${BUTTON} border border-line-strong bg-surface text-ink hover:bg-page`}>
          <Icon name="mail" size={18} className="text-brand" />
          Email the trek team
        </a>
      </div>
      <p className="text-center text-xs break-words text-muted-foreground">
        WhatsApp {CONTACT.phoneDisplay} · {CONTACT.email} · Reply usually within a few hours
      </p>
    </div>
  </div>
);
