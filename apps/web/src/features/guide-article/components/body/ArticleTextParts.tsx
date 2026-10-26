import { getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";
import type { RichTextDoc } from "@ttn/ui/lib/richText";

import { RichText } from "@/components/shared/RichText";

import { FOCUS } from "../styles";

const TONES = {
  note: { box: "border-[#d3e3f1] bg-brand-tint", icon: "info", iconColor: "text-brand", label: "Note" },
  warning: { box: "border-saffron-line bg-saffron-tint", icon: "warning", iconColor: "text-saffron-deep", label: "Warning" },
} as const;

/** "Note or warning": a coloured box that stands out from the text. */
export const ArticleCallout = ({ tone, body }: { tone: keyof typeof TONES; body: RichTextDoc }) => {
  const look = TONES[tone];
  return (
    <aside aria-label={look.label} className={`flex gap-3 rounded-xl border px-5 py-4.5 ${look.box}`}>
      <Icon name={look.icon} size={22} className={`mt-0.5 flex-none ${look.iconColor}`} />
      <RichText doc={body} headingLevel="h4" className="flex flex-col gap-2 text-[15px] leading-relaxed text-ink" />
    </aside>
  );
};

/** "Checklist": items with green ticks. */
export const ArticleChecklist = ({ heading, items }: { heading: string; items: readonly string[] }) => (
  <section aria-label={heading || "Checklist"} className="flex flex-col gap-3 rounded-xl border border-line bg-page px-5 py-4.5">
    {heading && <h3 className="font-display text-lg font-bold text-ink">{heading}</h3>}
    <ul className="flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-[15px] leading-relaxed text-text">
          <Icon name="check_circle" size={20} className="mt-0.5 flex-none text-whatsapp" />
          {item}
        </li>
      ))}
    </ul>
  </section>
);

/** "Pull quote": one strong sentence in large type. */
export const ArticlePullQuote = ({ text }: { text: string }) => (
  <blockquote className="border-y border-line py-5 text-center font-display text-[22px] leading-snug font-bold text-ink md:text-[26px]">“{text}”</blockquote>
);

/** "WhatsApp box": a green box with a button that opens WhatsApp with the message written. */
export const ArticleCta = ({ heading, buttonText, message }: { heading: string; buttonText: string; message: string }) => (
  <section aria-label={heading} className="flex flex-col items-start gap-3 rounded-2xl bg-green-tint px-5.5 py-5 sm:flex-row sm:items-center sm:justify-between">
    <p className="font-display text-lg font-bold text-ink">{heading}</p>
    <a
      href={getWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 flex-none items-center gap-2 rounded-full bg-whatsapp px-5 text-body-sm font-bold text-white hover:bg-whatsapp/90 ${FOCUS}`}
    >
      <Icon name="chat" size={18} />
      {buttonText}
    </a>
  </section>
);
