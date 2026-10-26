import { MapConsentGate } from "@/components/shared/MapConsentGate";
import { SiteImage } from "@/components/ui/SiteImage";
import { googleMapLinks } from "@/features/trek-detail/routeMap";
import type { SiteImageSource } from "@/lib/images";

const ARTICLE_WIDTH = "(min-width: 1280px) 640px, (min-width: 1024px) 60vw, 100vw";

/** "Photo": one large photo with its caption. */
export const ArticleFigure = ({ image, caption }: { image: SiteImageSource; caption: string }) => (
  <figure className="my-1">
    <div className="relative aspect-video overflow-hidden rounded-xl bg-brand-tint">
      <SiteImage image={image} sizes={ARTICLE_WIDTH} className="object-cover" />
    </div>
    {caption && <figcaption className="mt-2 text-caption font-normal text-muted-foreground">{caption}</figcaption>}
  </figure>
);

/** "Photo gallery": the photos in a grid, two across (three from tablets). */
export const ArticleGallery = ({ images }: { images: readonly SiteImageSource[] }) => (
  <ul aria-label="Photos" className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
    {images.map((image) => (
      <li key={image.src} className="relative aspect-4/3 overflow-hidden rounded-lg bg-brand-tint">
        <SiteImage image={image} sizes="(min-width: 768px) 220px, 50vw" className="object-cover" />
      </li>
    ))}
  </ul>
);

/** "Map": a Google map of the place, loaded only once the visitor allows it (privacy rules). */
export const ArticleMap = ({ title, place }: { title: string; place: string }) => {
  const { embedUrl } = googleMapLinks({ place });
  const label = title || place;
  return (
    <figure className="flex flex-col gap-2">
      <MapConsentGate preview={<div className="aspect-video w-full bg-brand-tint" />} previewLabel={`Map of ${label}`} noticePlacement="below">
        <iframe src={embedUrl} title={`Google map of ${label}`} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" className="block aspect-video w-full rounded-xl border-0" />
      </MapConsentGate>
      {title && <figcaption className="text-caption text-muted-foreground">{title}</figcaption>}
    </figure>
  );
};
