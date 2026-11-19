import type { SiteImageSource } from "@ttn/site-data/images";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiteImage } from "@/components/ui/SiteImage";

import type { HomePoint, HomeTrek } from "../types";

/** How each of the first six tiles looks (design: Highlights bento): a photo, maroon, white, saffron or a wide photo. */
type TileLook = { kind: "photo" | "maroon" | "white" | "saffron"; span: string };
const LOOKS: readonly TileLook[] = [
  { kind: "photo", span: "md:col-span-2 md:row-span-2" },
  { kind: "photo", span: "" },
  { kind: "maroon", span: "" },
  { kind: "white", span: "" },
  { kind: "saffron", span: "" },
  { kind: "photo", span: "md:col-span-4" },
];
const GROUNDS = { maroon: "bg-maroon text-snow", white: "border border-solid border-line bg-snow", saffron: "border border-solid border-saffron-line bg-saffron-tint" } as const;

type TileProps = { point: HomePoint; index: number; look: TileLook; photo?: SiteImageSource };

const Tile = ({ point, index, look, photo }: TileProps) => {
  const isPhoto = look.kind === "photo" && photo;
  const isLight = !isPhoto && look.kind !== "maroon";
  const isBig = index === 0;
  return (
    <li className={`relative flex min-h-62.5 flex-col justify-end gap-1.5 overflow-hidden rounded-[20px] p-6 ${look.span} ${isPhoto ? "bg-ink text-snow" : GROUNDS[look.kind === "photo" ? "maroon" : look.kind]}`}>
      {isPhoto && (
        <>
          <SiteImage image={photo} sizes={isBig ? "(min-width: 768px) 620px, 100vw" : "(min-width: 768px) 620px, 100vw"} className="object-cover" />
          <span aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-ink/0 from-30% to-ink/85" />
        </>
      )}
      <span className={`relative text-sm leading-none font-bold tracking-[0.12em] ${isLight ? "text-saffron-ink" : "text-saffron-light"}`}>{String(index + 1).padStart(2, "0")}</span>
      <h3 className={`relative ${isBig ? "text-[34px]! leading-10!" : "text-[21px]! leading-6.5!"} ${isLight ? "" : "text-snow!"}`}>{point.title}</h3>
      {point.text && <p className={`relative m-0 ${isBig ? "max-w-115 text-[17px] leading-6.75" : "text-[15px] leading-5.5"} ${isLight ? "text-muted" : "text-on-maroon-muted"}`}>{point.text}</p>}
    </li>
  );
};

/**
 * "Why this valley" (design: Highlights): the trek's highlights as a bento of tiles, the first large; photo tiles take
 * the trek's photos after the ones at the top of the page. Highlights after the sixth follow as plain tiles.
 */
export const TrekHighlights = ({ highlights, photos }: { highlights: HomeTrek["highlights"]; photos: readonly SiteImageSource[] }) => {
  const pool = photos.slice(3).length >= 3 ? photos.slice(3) : photos;
  let next = 0;
  const photoFor = (look: TileLook) => (look.kind === "photo" ? pool[next++] : undefined);

  return (
    <section aria-labelledby="highlights-h" id="highlights" className="flex flex-col gap-9">
      <SectionHeading id="highlights-h" eyebrow="Why this valley" title={highlights.heading} />
      <ul className="m-0 grid list-none auto-rows-[minmax(250px,auto)] grid-cols-1 gap-4 p-0 md:grid-cols-4">
        {highlights.points.map((point, index) => {
          const look = LOOKS[index] ?? { kind: "white", span: "" };
          return <Tile key={point.title} point={point} index={index} look={look} photo={photoFor(look)} />;
        })}
      </ul>
    </section>
  );
};
