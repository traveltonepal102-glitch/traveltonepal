import Image from "next/image";

type ChatMessage = { from: "trekker" | "guide"; time: string; lines: readonly (string | { label: string; value: string })[] };

/** The design's example conversation: the guide asks first, then suggests the trek that fits (Main.dc.html). */
const MESSAGES: readonly ChatMessage[] = [
  {
    from: "trekker",
    time: "10:14 AM",
    lines: [
      "Hi! I'd like to ask about this trek:",
      { label: "Trek", value: "Langtang Valley Trek for 10 days" },
      { label: "Group size", value: "3 people" },
      { label: "Dates", value: "flexible, April 2027" },
      { label: "My name", value: "Anna" },
    ],
  },
  { from: "guide", time: "10:16 AM", lines: ["Namaste Anna! Have you trekked at high altitude before? And how fit would you say you are?"] },
  { from: "trekker", time: "10:21 AM", lines: ["No, it's our first trek. We're fairly fit, but steep climbs worry us. We'd also like less crowded trails."] },
  {
    from: "guide",
    time: "10:24 AM",
    lines: [
      "Langtang is a great first trek. Kyanjin Ri and Tserko Ri are steep, so I'd suggest a day hike to Langshisha Valley instead. The climb is gradual and few trekkers go there. Sound good?",
    ],
  },
];

/** WhatsApp's own green for messages you send, so the example reads as a WhatsApp chat. */
const WHATSAPP_BUBBLE = "bg-[#d9fdd3]";

/** Example WhatsApp chat (design: Main.dc.html, "How booking works"). An illustration, not a live chat. */
export const ChatPreview = () => (
  <figure className="flex w-full max-w-107.5 flex-col gap-3 rounded-3xl border border-line bg-brand-tint p-5 shadow-raised">
    <figcaption className="sr-only">Example of a trek inquiry and reply on WhatsApp</figcaption>

    <div aria-hidden="true" className="flex items-center gap-3 border-b border-line-strong pb-3">
      <span className="inline-flex size-11 flex-none items-center justify-center rounded-full border border-line bg-surface p-1.5">
        <Image src="/brand/logo-mark.svg" alt="" width={15} height={30} className="h-7.5 w-auto" />
      </span>
      <span className="flex flex-col">
        <span className="text-sm leading-[18px] font-bold text-ink">Travel To Nepal</span>
        <span className="text-xs leading-4 font-semibold text-whatsapp">Experienced trek guide: Sandip · Online</span>
      </span>
    </div>

    {MESSAGES.map((message) => {
      const isTrekker = message.from === "trekker";
      return (
        <p
          key={message.time}
          className={`max-w-[85%] px-3 py-2.5 text-[13px] leading-5 text-ink ${
            isTrekker ? `self-end rounded-[14px_4px_14px_14px] ${WHATSAPP_BUBBLE}` : "self-start rounded-[4px_14px_14px_14px] bg-surface"
          }`}
        >
          {message.lines.map((line, index) => (
            <span key={index} className="block">
              {typeof line === "string" ? (
                line
              ) : (
                <>
                  <strong>{line.label}:</strong> {line.value}
                </>
              )}
            </span>
          ))}
          <span className="block text-right text-[11px] text-muted-foreground">{message.time}</span>
        </p>
      );
    })}
  </figure>
);
