import { Icon } from "@ttn/ui/icon";

import type { PhotoText } from "../types";

type PhotoTextSummaryProps = { text: PhotoText };

const Line = ({ label, value, isMuted = false }: { label: string; value: string; isMuted?: boolean }) => (
  <p className={`m-0 line-clamp-2 text-xs ${isMuted ? "text-muted-foreground" : "text-text"}`} title={value}>
    <span className="font-semibold text-ink">{label}: </span>
    {value}
  </p>
);

/** What is typed about a library photo (alt text, caption, taken at), short; a missing alt text is flagged. */
export const PhotoTextSummary = ({ text }: PhotoTextSummaryProps) => (
  <div className="flex flex-col gap-1">
    {text.altText ? (
      <Line label="Alt text" value={text.altText} />
    ) : (
      <p className="m-0 inline-flex items-center gap-1 self-start rounded-full bg-saffron-tint px-2.5 py-0.5 text-xs font-bold text-saffron-ink">
        <Icon name="warning" size={14} />
        Needs alt text
      </p>
    )}
    {text.caption && <Line label="Caption" value={text.caption} isMuted />}
    {text.place && <Line label="Taken at" value={text.place} isMuted />}
  </div>
);
