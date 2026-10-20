type PageSectionHeadingProps = {
  id: string;
  eyebrow: string;
  title: string;
  text?: string;
  /** "green" e.g. for licences, "onDark" on a navy band. */
  tone?: "brand" | "green" | "onDark";
};

const TONES = {
  brand: { eyebrow: "text-brand", title: "", text: "text-text" },
  green: { eyebrow: "text-whatsapp", title: "", text: "text-text" },
  onDark: { eyebrow: "text-saffron", title: "text-white", text: "text-white/85" },
} as const;

/** Eyebrow, H2 and an optional line that open a page section (About and Contact pages). */
export const PageSectionHeading = ({ id, eyebrow, title, text, tone = "brand" }: PageSectionHeadingProps) => {
  const look = TONES[tone];

  return (
    <div className="flex max-w-180 flex-col gap-1.5">
      <p className={`text-eyebrow uppercase ${look.eyebrow}`}>{eyebrow}</p>
      <h2 id={id} className={`text-h2-sm tracking-tight md:text-h2 ${look.title}`}>
        {title}
      </h2>
      {text && <p className={`text-[15px] ${look.text}`}>{text}</p>}
    </div>
  );
};
